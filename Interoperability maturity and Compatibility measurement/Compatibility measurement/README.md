# IIOP demo

The identifier interoperability (IIOP) of 2 datasets is the ratio of the real-world concepts identified with the same identifier across the 2 datasets over the total of real-world objects identified within the two datasets that overlap. The relevance of the interoperability is the number of facts where real-world objects are mentioned.

This Demo uses a methodology from Colpaert et al. 2014

## Step 0: what do you think?

In order to evaluate the score, we will ask you to first take a look at the datasets at  https://w3id.org/onto/ and compare them to  https://w3id.org/onto/reference. Give your own score to it for both the interoperability itself, as a relevance number for the interoperability.

You can use this questionnaire: https://docs.google.com/forms/d/1xb-Fz6KsCX92WYkcB_CRHI5RlewEHVvEJnkuiTaxzzQ/viewform#start=openform

The results of the questionnaire can be found here: TBA

## Step 1: Transforming the data towards triples

Tools such as open refine can be used to transform the datasets into triples. Each time, every id is concatenated with the URI of the dataset (e.g., https://w3id.org/onto/emdat/7062 for the identifier of the first row or  https://w3id.org/onto/emdat/long as the identifier of the concept of longitude).

Tools like [Open Refine](http://openrefine.org), [RML](http://semweb.mmlab.be/ns/rml) or [DataLift](http://datalift.org) can be used. These tools map data towards triples.

_Caveat lector: even when we would have a dataset in RDF, we would still concatenate each URI with the dataset URI: we need a unique identifier for each identifier used in each dataset._

In this demo we have used Open Refine. The result of the mapping are put in the respective dataset folders in this repository:
 * reference/reference.ttl
 * emdat/emdat.ttl
 * response/response.ttl
 * riskdata/riskdata.ttl
 * rainfall/rainfall.ttl
 * poverty/poverty.ttl
 * landcover/landcover.ttl

Using a command-line tool which can be installed on debian/ubuntu systems using `apt-get install raptor2-utils`, we have converted the datasets into n-triples.

For each dataset we did:
```bash
rapper -i turtle -o ntriples emdat.ttl > emdat.nt
```

This generated this amount of triples:

Dataset | number of triples
:------:|-------------------:
reference| 133
emdat| 76
response | 180
riskdata | 174
rainfall | 50
poverty | 40
landcover|60

## Step 2: Generating the list of identifiers

For each dataset, we generated a file containing all the IDs defined in a dataset. Using the n-triples file, we can generate this quickly using this bash command for each dataset:

```bash
cut -d" " response.nt -f1,2,3 --output-delimiter="
" | grep "^<" | sort | uniq > ids.txt
```

Dataset | number of IDs
:------:|-------------------:
reference| 25
emdat | 19
response | 27
riskdata | 33
rainfall| 14
landcover|16
__Total__ | __149__

## Step 3: Getting the real world input

There are various ways to get to the real-world input: you can crowd-source it, you can reason over already existing data or you can fill it out yourself. The result of this step should be an n-triples file which contains for each identifier whether it does or does not mean the same in the real world. The predicates that we are going to use for this are defined at http://semweb.mmlab.be/ns/iiop ; `iiop:sameAs` and `iiop:notSameAs`. For this dataset this means we need from 149 ids,  1(49*148=)22052 statements. As these statements are unknown at this moment, we can generate a list of 22052 questions.

During the process of solving these questions yourself, you can use a reasoner to assist you. Each time a statement is added, the reasoner will then check whether more questions can be derived.
In this case, we will use the reasoner by Ruben Verborgh which uses the EYE software. We will use this query:
```n3
@prefix iiop: <http://semweb.mmlab.be/ns/iiop#> .
{ ?a iiop:sameAs ?b . } => { ?b iiop:sameAs ?a . } .
{ ?a iiop:notSameAs ?b . } => { ?b iiop:notSameAs ?a . } .
{ ?a iiop:sameAs ?b . ?b iiop:sameAs ?c . }
=>
{ ?a iiop:sameAs ?c . } .
{ ?a iiop:notSameAs ?b . ?b iiop:sameAs ?c . }
=>
{ ?a iiop:notSameAs ?c . } .
```

### Step 3a: Generating the list of questions

An iiop question is a triple with 1 unknown predicate. The predicate can be `iiop:sameAs` or `iiop:notSameAs`:
```turtle
<id1> ?unknown <id2> .
```

In order to generate this list, we first generate a list of all identifiers in our system. This is easy, as we already have made a list of all identifiers in each dataset.

```bash
cat reference/ids.txt emdat/ids.txt response/ids.txt rainfall/ids.txt riskdata/ids.txt poverty/ids.txt landcover/ids.txt > ids.txt
```

Now, this list will be used to generate a list `questions.nt`. This is solved using 2 while loops:

```bash
while read id1 ; do {
  while read id2 ; do {
    [[ $id1 != $id2 ]] && echo "$id1 ?unknown $id2 . " ; 
  } done < ids.txt ;
} done < ids.txt > questions.nt
```

### Step 3b: Answering the questions

Answering the question can be done in various ways. Each kind of set of data might be able to use its own methods: if we're talking about geospatial data, the identifiers can be compared on a map, if we're talking about tabular data, a mapping GUI could be made. We are going to use a more rudimental approach: we're going to copy the `questions.nt` towards `iiopstatements.nt` and we're going to use a text editor to find-replace-all `?unknown` with `<http://semweb.mmlab.be/ns/iiop#notSameAs>`. Each time we find an identifier which is not the same, we're going to hit "`yes`, replace". If it is the same in the real world, we're going to hit "`no`, don't replace". Afterwards, all remaining `?unknown` will be replace by `<http://semweb.mmlab.be/ns/iiop#notSameAs>`.

After uploading the files on our server, we can use the EYE Reasoner to help us a bit in the process (note that this can actually be implemented by the GUI):
```bash
eye --n3 iiopstatements.nt& --query query.n3 --nope >temp.ttl
rapper -i turtle -o ntriples temp.ttl > temp.nt
cp iiopstatements.nt  temp2.nt
cat temp.nt temp2.nt questions.nt | sort -t " " -k 1,1b -k 3,3b | sed 's/[ ]*$//' | uniq > answers.nt
rm temp.nt temp.ttl temp2.nt 
```
You can then reopen answers.nt in your editor, remove the duplicates, and carry on with your work.

Remove duplicates using Emacs regex (C-M %)
```
\(<.*?>\) \(<http://semweb.mmlab.be/ns/iiop#n?o?t?[sS]ameAs>\) \(<.*?>\) .
\1 \?unknown \3 . 
```
with
```
\1 \2 \3 .

```

And you can carry on.

## Step 4: Making the calculations



### Identifiers time their use in triples

#### Relevance of string matching identifiers

The current relevance is the number of triples that would be returned if the 2 datasets would be joined together, only matching the true positives.

For instance for response do this:
```bash
datasetname=response;
alltriples=$( cat reference/reference.nt $datasetname/$datasetname.nt | sort | uniq ; );
grep -E "reference/(.*?)> <http://semweb.mmlab.be/ns/iiop#sameAs> <https://.*?/$datasetname/\1>" iiopstatements.nt | cut -d" " -f1,3 | { while read id1 id2 ; do
    joined=${id1/https:\/\/w3id.org\/gicenter\/ont\/reference/https:\/\/example.com\/joined};
     #joined=${id2/http:\/\/w3id.org\/gicenter\/ont\/$datasetname/http:\/\/example.com\/joined};
    alltriples=${alltriples//$id1/$joined} ;
    alltriples=${alltriples//$id2/$joined} ;
    #echo "$alltriples" | grep joined; 
done ;
echo "$alltriples" | sort | uniq > $datasetname/joined_reference.nt ;
}
cut -d" " -f1,2,3 --output-delimiter="
" $datasetname/joined_reference.nt | grep '/joined' | wc -l
```

#### Maximum relevance possible

This is the count of the usage of matching identifier when we are making the `iiop:sameAs` links the same.

```bash
datasetname=ghent1;
alltriples=$( cat reference/reference.nt $datasetname/$datasetname.nt | sort | uniq ; );
grep -E "reference/.*?> <http://semweb.mmlab.be/ns/iiop#sameAs> <https://.*?/$datasetname/.*?>" iiopstatements.nt | cut -d" " -f1,3 | { while read id1 id2 ; do
    joined=${id1/https:\/\/w3id.org\/gicenter\/ont\/reference/http:\/\/example.com\/joined};
    #joined=${id2/https:\/\/w3id.org\/gicenter\/ont\/$datasetname/http:\/\/example.com\/joined};
    alltriples=${alltriples//$id1/$joined} ;
    alltriples=${alltriples//$id2/$joined} ;
done ;
echo "$alltriples" | sort | uniq > $datasetname/joined_max_reference.nt ;
}
cut -d" " -f1,2,3 --output-delimiter="
" $datasetname/joined_max_reference.nt | grep '/joined' | wc -l
```

#### Relevance ratio

The relevance ratio is the ratio of the relevance over the sum of both triple counts.

The end results is this table:

Reference and ... | Relevance of stringmatching IDs| Relevance of real-world concepts | Relevance  ratio  | Expert opinion  
:----------------:|-----------------:|------------------:|------------------:|-----------------:
Landcover           |    0          |        0        |                0% | low
Rainfall           |     20        |       20         |                 100% | high 
emdat           |        209      |    300             |                69.7% |medium 
Risk data       |      32       |         32        |                100% | high            
Response data |       270      |        330        |                 81%|  high
Poverty data |      38       |          38        |                 100% | high
## Step 5: Processing feedback

The list of IIOP statements is a great opportunity to process feedback. Both the `iiop:notSameAs`as the `iiop:sameAs` statements are interesting for feedback towards the dataset maintainer. Each `iiop:sameAs` link can be considered as an opportunity to use the same identifiers across datasets.

The `iiop:notSameAs` is also a great opportunity to find conflicts between datasets. If you count the number of conflicts: string matches in the IDs, but there is a `iiop:notSameAs` statement. To calculate this, you can perform this small trick:

```bash
grep -E 'response/(.*?)> <http://semweb.mmlab.be/ns/iiop#notSameAs> <http://.*?/\1>' iiopstatements.nt | wc -l
```

No datasets conflict with the reference dataset.:

```turtle
<https://w3id.org/gicenter/ont/response/location> <http://semweb.mmlab.be/ns/iiop#notSameAs> 
```



In order to reduce conflicts, we can start making use of URIs and point to global definitions of certain predicates or other concepts. If no URI is defined for what you want to put in the semantics of the identifier, then you can create your own identifier.

