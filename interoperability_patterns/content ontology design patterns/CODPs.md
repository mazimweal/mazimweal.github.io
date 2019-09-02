<b>Context</b>
 disaster related information held by different stakeholders is heterogeneous and described in multiple schemas, markup languages,
with different vocabularies and conceptualizations. Ontologies can be used to provide a unified semantic representation of the domain, along with superior capabilities in querying and information retrieval.

<b>Problem :</b>
These ontologies tend to be abstract, introduce ontological commitments and are difficult for domain experts and novice users
to handle without the support of a Knowledge Engineer thus critical for managing interoperability between heterogeneous data sources. 

<b>Solution: </b>
Finally, to overcome these limitations, ontology design patterns have been proposed as proven best practices, that are flexible, reusable building blocks for modeling reoccurring tasks. Patterns can also be combined and ultimately aligned with foundational ontologies that act as glue between patterns, making it easy for domain experts to integrate disaster knowledge without the assistance of knowledge engineers. Pattern use will also enable disaster domain experts to populate the global pattern schema based on local use case scenarios depending on data availability, institutional frameworks and policies.


Research Challenge: While the Ontology Design patterns(ODPs) community has a portal that lends support to ontology engineering with ODPs, there is still lack of critical mass of patterns/proven best practices . Identification of these patterns could go a long way to supporting ontology engineering, thereby bridging the gap between the demand and availability of ODPs while representing disaster knowledge

A List of patterns that can be reused to organise disaster data in the context of uganda have been elaborated the publication the Authors presented at the 28th WETICE IEEE conference (June 12-15 Anacapri-Napoli,Italy)
some of these patterns  are listed here. A list of these patterns can be found at http://ontologydesignpatterns.org/wiki/Category:ProposedContentOP


Pattern   | Name |Competency questions
:------:|-------------------:|-----------------------:
1| Event Pattern | 1-Where did hazard occur in 2013? <br/> 2-Which hazards occurred between 2013 and 2018 in Uganda? <br/> 3-When did the 2010 hazard (e.g landslide) take place? when is it expected to occur
2|Event Type pattern|1-What are the abstract qualities of a particular EventType that classifies an event? e.g risky event, hazard event etc.<br/> 2) What concepts classify an event?
3|Place Pattern | 1-Where did hazard event occur? <br/> 2-Which areas are prone to hazards?
4|Organisation, agent Role patterns| 1-Which organizations are stakeholders in disaster Organisation, management? e.g Government of Uganda <br/> 2-Who are the actors/agents involved in disaster management? <br/> 3-What role do the actors perform? E.g donors, response etc. 
5|Activity Specificaction patterns|1-What event is likely to be triggered by changes Activity in another event e.g Extreme weather event specification (EWE)? (Cascading/compound/complex disasters) <br/> 2-What activity is triggered by a change in weather events? e.g rockfall triggered by EWE <br/> 3-What activity triggers an event/state? e.g rockfall triggers landslide <br/> 4 -What class of objects could satisfy precondition for rockfall? e.g above average rainfall leads to a rockfall <br/> 5- What triggers DRF for a hazard event?
6|value partitions pattern | 1-What are the elements at risk when the hazard occurs? E.g crops, built up areas  quantified with land cover/ land use
7|News Reporting Pattern| 1-Which communities need to be sensitized News about what? when? which media? Reporting<br/> Which media should be used for sensitization? e.g radio, TV, News bulletins etc<br/>2- Who reports the actual event? <br/> 3- What is the affiliation of the reporter <br/>4- When was a hazard event reported for the first time
8|Funding pattern| 1-How was the disaster/emergency funded? Funding,<br/> 2-E.g. who funded compensations? <br/>3- What role do the actors perform E.g. PI, donor, AgencyProgrameManager <br/> 4- Which communities/households should receive disaster risk financing (DRF)?
9| Quality, participation patterns|1- Which communities are more vulnerable to impacts of a given hazard? <br/> 2- What fragilities does the community Quality, that participates in hazard event exhibit?<br/> 3- What coping/adaptive mechanisms are used Participation to reduce vulnerability of an object participating in hazard event?
10 | Quality Causation pattern|1-Which qualities of the community could cause change in vulnerability of the same community?,<br/> 2- What is the interpretation of the causation relationship between vulnerability, susceptibility/fragility/sensitivity and resilience of a community?

