import React from 'react';
import { Card } from 'antd';

const ItemListe: React.FC = () => {
  return (
    <div>
      <h1>Item-Liste</h1>
      <Card>
        <p>Item list management coming soon...</p>
        <p>This page will allow you to:</p>
        <ul>
          <li>Create and manage device master list</li>
          <li>Assign devices to rooms</li>
          <li>Configure quantities and positions</li>
        </ul>
      </Card>
    </div>
  );
};

export default ItemListe;
