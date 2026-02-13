import React from 'react';
import { Card } from 'antd';

const Raumbuch: React.FC = () => {
  return (
    <div>
      <h1>Raumbuch</h1>
      <Card>
        <p>Raumbuch management coming soon...</p>
        <p>This page will allow you to:</p>
        <ul>
          <li>Create and manage projects</li>
          <li>Define zones (EG, OG, UG, etc.)</li>
          <li>Add and organize rooms</li>
        </ul>
      </Card>
    </div>
  );
};

export default Raumbuch;
