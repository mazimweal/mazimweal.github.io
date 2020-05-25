import React from 'react';

const ResultsArea = ({ results, error }) => {
  return (
    <div>
      <div className="FormQueryResults">
        <h2>Query results</h2>
        <div className="QueryResultsDisplay">
          {error ? error : (
            results.map((result, index) => (
              <div key={index}>
                {Object.keys(result).map((keyName, index) => (
                  <div key={index}><p className="QueryResultHeading1">{keyName}&nbsp;:</p> {
                    Object.keys(result[keyName]).map((keyName2, index) => (
                      typeof result[keyName][keyName2] !== 'object' ?
                        <div key={index}><p className="QueryResultHeading2">{keyName2}&nbsp;:</p> {result[keyName][keyName2]}</div> :
                        Object.keys(result[keyName][keyName2]).map((keyName3, index) => (
                          <div key={index}>{keyName3}: {result[keyName][keyName2][keyName3]}</div>
                        ))
                    ))
                  } <br key={index} /></div>
                ))}
              </div>
            )
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultsArea;
