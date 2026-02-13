import React from 'react';
import { Card, Tabs } from 'antd';

const Metadata: React.FC = () => {
  const items = [
    {
      key: 'trades',
      label: 'Gewerke',
      children: <p>Manage trades (Beleuchtung, Steckdosen, KNX, etc.)</p>,
    },
    {
      key: 'categories',
      label: 'Kategorien',
      children: <p>Manage categories within trades</p>,
    },
    {
      key: 'connections',
      label: 'Anschlüsse',
      children: <p>Manage connection types (230V AC, KNX, DALI, etc.)</p>,
    },
    {
      key: 'installzones',
      label: 'Installationszonen',
      children: <p>Manage installation zones (oben, Mitte, Steckdose, etc.)</p>,
    },
  ];

  return (
    <div>
      <h1>Metadaten</h1>
      <Card>
        <Tabs items={items} />
      </Card>
    </div>
  );
};

export default Metadata;
