import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { roomDeviceService } from '../../services';
import type * as Types from '../../types';
import RoomDeviceForm from './RoomDeviceForm';

interface RoomDeviceListProps {
  roomId: string;
  roomName: string;
  projectId: string;
}

interface RoomDeviceWithRelations extends Types.RoomDevice {
  device?: { name: string; code?: string };
  trade?: { name: string; code?: string };
  category?: { name: string; code?: string };
  connection?: { name: string; code?: string };
  installZone?: { name: string; code?: string };
}

const RoomDeviceList: React.FC<RoomDeviceListProps> = ({ roomId, roomName, projectId }) => {
  const [roomDevices, setRoomDevices] = useState<RoomDeviceWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoomDevice, setEditingRoomDevice] = useState<Types.RoomDevice | null>(null);

  useEffect(() => {
    if (roomId) {
      loadRoomDevices();
    }
  }, [roomId]);

  const loadRoomDevices = async () => {
    try {
      setLoading(true);
      const data = await roomDeviceService.getByRoom(roomId);
      setRoomDevices(data);
    } catch (error) {
      message.error('Fehler beim Laden der Geräte');
      console.error('Failed to load room devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRoomDevice(null);
    setIsModalOpen(true);
  };

  const handleEdit = (roomDevice: Types.RoomDevice) => {
    setEditingRoomDevice(roomDevice);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await roomDeviceService.delete(id);
      message.success('Gerät entfernt');
      loadRoomDevices();
    } catch (error) {
      message.error('Fehler beim Löschen');
      console.error('Failed to delete room device:', error);
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingRoomDevice(null);
    loadRoomDevices();
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: '10%',
      sorter: (a: RoomDeviceWithRelations, b: RoomDeviceWithRelations) => 
        (a.code || '').localeCompare(b.code || ''),
    },
    {
      title: 'Bezeichnung',
      dataIndex: 'designation',
      key: 'designation',
      width: '20%',
      sorter: (a: RoomDeviceWithRelations, b: RoomDeviceWithRelations) => 
        a.designation.localeCompare(b.designation),
    },
    {
      title: 'Gewerk',
      key: 'trade',
      width: '12%',
      render: (_: any, record: RoomDeviceWithRelations) => {
        if (record.trade) {
          return <Tag color="blue">{record.trade.code || record.trade.name}</Tag>;
        }
        return '-';
      },
    },
    {
      title: 'Kategorie',
      key: 'category',
      width: '12%',
      render: (_: any, record: RoomDeviceWithRelations) => {
        if (record.category) {
          return <Tag color="green">{record.category.code || record.category.name}</Tag>;
        }
        return '-';
      },
    },
    {
      title: 'Anschluss',
      key: 'connection',
      width: '10%',
      render: (_: any, record: RoomDeviceWithRelations) => {
        if (record.connection) {
          return record.connection.code || record.connection.name;
        }
        return '-';
      },
    },
    {
      title: 'Inst.Zone',
      key: 'installZone',
      width: '10%',
      render: (_: any, record: RoomDeviceWithRelations) => {
        if (record.installZone) {
          return record.installZone.code || record.installZone.name;
        }
        return '-';
      },
    },
    {
      title: 'Anzahl',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '8%',
      align: 'center' as const,
    },
    {
      title: 'Ziel',
      dataIndex: 'target',
      key: 'target',
      width: '10%',
      ellipsis: true,
    },
    {
      title: 'Aktionen',
      key: 'actions',
      width: '8%',
      render: (_: any, record: Types.RoomDevice) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Gerät entfernen?"
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
        title={`Geräte in ${roomName}`}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Gerät hinzufügen
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={roomDevices}
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 15, 
            showSizeChanger: true,
            showTotal: (total) => `${total} Geräte` 
          }}
          size="small"
        />
      </Card>

      <RoomDeviceForm
        open={isModalOpen}
        roomDevice={editingRoomDevice}
        roomId={roomId}
        projectId={projectId}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingRoomDevice(null);
        }}
      />
    </>
  );
};

export default RoomDeviceList;
