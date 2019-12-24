Ontology Design patterns for Representing disaster Knowledge
===================
The world is changing fast with increasing numbers of both natural and man-made hazards that expose vast vulnerable
communities to adverse impacts. An integrative approach to disaster management that involves multi-sectoral collaboration to ensure
proper management and resourcing of pre-disaster, disaster and post-disaster effort is required. The success of the integrated disaster
management approach depends on the ability of multiple stakeholders to share information so that the right people can  make the right decisions at the right time. However, disasterrelated information held by different stakeholders is heterogeneous and described in multiple schemas, markup languages, with different vocabularies and conceptualizations


Role of Ontology Design Patterns.
===================
Ontologies can be used to provide a unified semantic representation of the domain, along with superior capabilities in querying and information retrieval. Ontology design patterns (ODPs) have been proposed as proven best practices, that are flexible, reusable building blocks for modelling reoccurring tasks thus critical for managing interoperability between heterogeneous data sources. Patterns can also be combined and ultimately aligned with foundational ontologies that act as glue between patterns, making it easy for domain experts to integrate disaster knowledge without the assistance of knowledge engineers. 

Patterns for organising data in the disaster management sector
============
Examples of patterns for managing data in the disaster management sector 

Pattern   | Name |Competency questions
:------:|-------------------:|-----------------------:
1| Event Pattern | 1-Where did hazard occur in 2013? <br/> 2-Which hazards occurred between 2013 and 2018 in Uganda? <br/> 3-When did the 2010 hazard (e.g landslide) take place? when is it expected to occur
2|Event Type pattern|1-What are the abstract qualities of a particular EventType that classifies an event? e.g risky event, hazard event etc.<br/> 2) What concepts classify an event?
3|Place Pattern | 1-Where did hazard event occur? <br/> 2-Which areas are prone to hazards?
4|Organisation, agent Role patterns| 1-Which organizations are stakeholders in disaster Organisation, management? e.g Government of Uganda <br/> 2-Who are the actors/agents involved in disaster management? <br/> 3-What role do the actors perform? E.g donors, response etc. 
5|Activity Specification patterns|1-What event is likely to be triggered by changes Activity in another event e.g Extreme weather event specification (EWE)? (Cascading/compound/complex disasters) <br/> 2-What activity is triggered by a change in weather events? e.g rockfall triggered by EWE <br/> 3-What activity triggers an event/state? e.g rockfall triggers landslide <br/> 4 -What class of objects could satisfy precondition for rockfall? e.g above average rainfall leads to a rockfall <br/> 5- What triggers DRF for a hazard event?
6|value partitions pattern | 1-What are the elements at risk when the hazard occurs? E.g crops, built up areas  quantified with land cover/ land use
7|News Reporting Pattern| 1-Which communities need to be sensitized News about what? when? which media? Reporting<br/> Which media should be used for sensitization? e.g radio, TV, News bulletins etc<br/>2- Who reports the actual event? <br/> 3- What is the affiliation of the reporter <br/>4- When was a hazard event reported for the first time
8|Funding pattern| 1-How was the disaster/emergency funded? Funding,<br/> 2-E.g. who funded compensations? <br/>3- What role do the actors perform E.g. PI, donor, AgencyProgrameManager <br/> 4- Which communities/households should receive disaster risk financing (DRF)?
9| Quality, participation patterns|1- Which communities are more vulnerable to impacts of a given hazard? <br/> 2- What fragilities does the community Quality, that participates in hazard event exhibit?<br/> 3- What coping/adaptive mechanisms are used Participation to reduce vulnerability of an object participating in hazard event?
10 | Quality Causation pattern|1-Which qualities of the community could cause change in vulnerability of the same community?,<br/> 2- What is the interpretation of the causation relationship between vulnerability, susceptibility/fragility/sensitivity and resilience of a community?

1 a) -Install the Triple fragments server using instructions from 
``https://github.com/LinkedDataFragments/Server.js``
b) create a configuration file ``config.json``

2- Download the Linked data Fragments  client browser-- a) configure the ``settings.json`` to add data sources, b)to the queries folder, Add queries to be executed  as illustrated in examples below to query disaster related data from multiple stakeholders.

Example of impact data from Office of prime minister organised using Event, place, AgentRole, organisation patterns --https://mazimweal.inrupt.net/public/impactsdata1.ttl
```hazardQuery
#60.Hazardevents with ODPs_impact data
# Datasource: http://localhost:5000/impactsdata1

select *
where {?subject rdfs:subClassOf hazardimpact:ReportedEvent.
             ?x   rdf:type ?subject;
                  hazardimpact:occursAtPlace ?place;
                  hazardimpact:hasReport ?report.
  ?report hazardimpact:containsImpactIndicator ?ind.
  ?ind hazardimpact:number_dead ?dead;
       hazardimpact:crops_damaged ?cropsInHectares.
  filter(?subject=hazardimpact:DROUGHT) 

}
```

Example of  organising  early warning information(using a case of a drought) from Meterological Authority using....Event, event type, quality, region/parameter patterns
https://mazimweal.inrupt.net/public/WeatherData.ttl
```Query weather data
 #61.Weather data
#Datasource: <http://localhost:5000/WeatherData#>

SELECT  ?x ?place ?classifying_concept ?spi ?spi_indexValue 
WHERE {
	    ?x rdf:type sat1:WeatherEvent ;
	           sat1:IsClassifiedBy ?classifying_concept;
                 sat1:occursAtPlace ?place.
    	?classifying_concept sat1:hasQuality ?magnitude.
    	?magnitude sat1:hasRegion ?spi.
    	?spi sat1:hasRegionValue ?spi_indexValue.
    	?spi sat1:hasParameter ?parameter.
    	?classifying_concept sat1:isParameterizedBy ?Parameter.
      
filter(parameter=sat1:Severely_dry)
}
```

Example of Vulnerability data organised using quality using the quality causation, quality, objectParticipation, RegionParameter


Integration of data using Ontology design patterns and access by Federated query over Linked data fragments
```federatedQuery
#61.query hazard impact data_OPM and weather information from UNMA
#Datasource: http://localhost:5000/impactsdata1  http://localhost:5000/WeatherData

select ?past_Event ?place ?location ?report ?dead ?cropsInHectares ?classifying_concept ?magnitude ?spi_indexValue ?parameter
where {?subject rdfs:subClassOf hazardimpact:ReportedEvent.
             ?past_Event   rdf:type ?subject;
                  hazardimpact:occursAtPlace ?place;
      hazardimpact:hasLocation ?location;
      #rdfs:comment ?coment;
      hazardimpact:hasReport ?report.
      ?report hazardimpact:containsImpactIndicator ?ind.
  ?ind hazardimpact:number_dead ?dead;
       hazardimpact:crops_damaged ?cropsInHectares.
      
      
      ?y rdf:type sat1:WeatherEvent ;
	           sat1:IsClassifiedBy ?classifying_concept;
                 sat1:occursAtPlace ?place;
                 sat1:hasLocation ?location.
      ?classifying_concept sat1:hasQuality ?magnitude.
    	?magnitude sat1:hasRegion ?spi.
    	?spi sat1:hasRegionValue ?spi_indexValue.
    	?spi sat1:hasParameter ?parameter.
    	?classifying_concept sat1:isParameterizedBy ?Parameter.
      filter(?parameter=sat1:Extremely_dry)
                 
} 
```




