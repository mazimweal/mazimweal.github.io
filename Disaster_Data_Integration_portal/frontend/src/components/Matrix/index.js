import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Matrix.css';

const Matrix = () => {  

  const data = [
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 3, y: 3 },
    { x: 4, y: 4 },
  ];

  const deita = [
    {x: 1, y: 3}
  ]

  return (
    <div className="MatrixContainer">

      <div className></div>
      
      <div className="MatrixBG"/>
      
      <div className="LabelY">Damage Potential</div>
      <div className="LabelX">Vulnerability</div>
      
      <div className="AxisLabelsY">
        <div>very low</div>
        <div>low</div>
        <div>high</div>
        <div>very high</div>
      </div>
      <div className="AxisLabelsX">
        <div>very low</div>
        <div>low</div>
        <div>high</div>
        <div>very high</div>
      </div>

      <>
        <ScatterChart
          width={400}
          height={300}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="Vulnerability" unit="" tickFormatter={() => ``} />
          <YAxis type="number" dataKey="y" name="Damage Potential" unit="" tickFormatter={() => ``}/>
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter className="ScatterHidden" name="A school" data={data} />
          <Scatter data={deita} fill="white" stroke="#000" />
        </ScatterChart>
      </>
    </div>
  )
};

export default Matrix
