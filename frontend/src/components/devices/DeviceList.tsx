import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { deviceService } from '../../services';
import type * as Types from '../../types';
import DeviceForm from './DeviceForm';

interface DeviceListProps {
  projectId: string;
}

interface DeviceWithRelations extends Types.Device {
  trade?: { name: string; code?: string };
  category?: { name: string; code?: string };
}

const DeviceList: React.FC<DeviceListProps> = ({ projectId }) => {
  const [devices, setDevices] = useState<DeviceWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Types.Device | null>(null);

  useEffect(() => {
    if (projectId) {
      loadDevices();
    }
  }, [projectId]);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const data = await deviceService.getByProject(projectId);
      setDevices(data);
    } catch (error) {
      message.error('Fehler beim Laden der Geräte');
      console.error('Failed to load devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingDevice(null);
    setIsModalOpen(true);
  };

  const handleEdit = (device: Types.Device) => {
    setEditingDevice(device);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deviceService.delete(id);
      message.success('Gerät gelöscht');
      loadDevices();
    } catch (error) {
      message.error('Fehler beim Löschen des Geräts');
      console.error('Failed to delete device:', error);
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingDevice(null);
    loadDevices();
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: '10%',
      sorter: (a: DeviceWithRelations, b: DeviceWithRelations) => 
        (a.code || '').localeCompare(b.code || ''),
    },
    {
      title: 'Gerätename',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      sorter: (a: DeviceWithRelations, b: DeviceWithRelations) => 
        a.name.localeCompare(b.name),
    },
    {
      title: 'Beschreibung',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Gewerk',
      dataIndex: ['trade', 'name'],
      key: 'trade',
      width: '15%',
      render: (_: any, record: DeviceWithRelations) => {
        if (record.trade) {
          return record.trade.code 
            ? `${record.trade.code} - ${record.trade.name}` 
            : record.trade.name;
        }
        return '-';
      },
    },
    {
      title: 'Kategorie',
      dataIndex: ['category', 'name'],
      key: 'category',
      width: '15%',
      render: (_: any, record: DeviceWithRelations) => {
        if (record.category) {
          return record.category.code 
            ? `${record.category.code} - ${record.category.name}` 
            : record.category.name;
        }
        return '-';
      },
    },
    {
      title: 'Aktionen',
      key: 'actions',
      width: '10%',
      render: (_: any, record: Types.Device) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Gerät löschen?"
            description="Sind Sie sicher?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ja"
            cancelText="Nein"
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title="Geräte-Stammdaten"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Neues Gerät
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={devices}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (total) => `${total} Geräte` }}
        />
      </Card>

      <DeviceForm
        open={isModalOpen}
        device={editingDevice}
        projectId={projectId}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingDevice(null);
        }}
      />
    </>
  );
};

export default DeviceList;
