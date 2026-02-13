import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Popconfirm, message, Modal, Form, Input, InputNumber, Drawer } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { roomService } from '../../services';
import type * as Types from '../../types';
import RoomDeviceList from '../roomDevices/RoomDeviceList';

interface RoomManagerProps {
  projectId: string;
  zoneId: string;
}

const RoomManager: React.FC<RoomManagerProps> = ({ projectId, zoneId }) => {
  const [rooms, setRooms] = useState<Types.Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Types.Room | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Types.Room | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (zoneId) {
      loadRooms();
    }
  }, [zoneId]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await roomService.getByZone(zoneId);
      setRooms(data);
    } catch (error) {
      message.error('Fehler beim Laden der Räume');
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRoom(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (room: Types.Room) => {
    setEditingRoom(room);
    form.setFieldsValue(room);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingRoom) {
        await roomService.update(editingRoom.id, values);
        message.success('Raum aktualisiert');
      } else {
        // Get next order
        const nextOrder = rooms.length;
        await roomService.create({
          zoneId,
          code: values.code,
          number: values.number,
          name: values.name,
          order: nextOrder,
        });
        message.success('Raum erstellt');
      }

      setIsModalOpen(false);
      setEditingRoom(null);
      loadRooms();
    } catch (error) {
      if (error instanceof Error && 'errorFields' in error) {
        return;
      }
      message.error('Fehler beim Speichern des Raums');
      console.error('Failed to save room:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await roomService.delete(id);
      message.success('Raum gelöscht');
      loadRooms();
    } catch (error) {
      message.error('Fehler beim Löschen des Raums');
      console.error('Failed to delete room:', error);
    }
  };

  const handleViewDevices = (room: Types.Room) => {
    setSelectedRoom(room);
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: '12%',
      sorter: (a: Types.Room, b: Types.Room) => a.code.localeCompare(b.code),
    },
    {
      title: 'Nummer',
      dataIndex: 'number',
      key: 'number',
      width: '10%',
      sorter: (a: Types.Room, b: Types.Room) => a.number - b.number,
    },
    {
      title: 'Raumname',
      dataIndex: 'name',
      key: 'name',
      width: '48%',
    },
    {
      title: 'Aktionen',
      key: 'actions',
      width: '30%',
      render: (_: any, record: Types.Room) => (
        <Space>
          <Button
            type="default"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDevices(record)}
          >
            Geräte
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Raum löschen?"
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
        title="Räume"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Neuer Raum
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={rooms}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingRoom ? 'Raum bearbeiten' : 'Neuer Raum'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingRoom(null);
        }}
        okText="Speichern"
        cancelText="Abbrechen"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="code"
            label="Raumcode"
            rules={[{ required: true, message: 'Bitte Raumcode eingeben' }]}
          >
            <Input placeholder="z.B. R1.01, EG-WZ" />
          </Form.Item>

          <Form.Item
            name="number"
            label="Raumnummer"
            rules={[{ required: true, message: 'Bitte Raumnummer eingeben' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="z.B. 1, 2, 3"
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="Raumname"
            rules={[{ required: true, message: 'Bitte Raumnamen eingeben' }]}
          >
            <Input placeholder="z.B. Wohnzimmer, Küche" />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={selectedRoom ? `${selectedRoom.code} - ${selectedRoom.name}` : 'Raumdetails'}
        placement="right"
        width="80%"
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedRoom(null);
        }}
        open={isDrawerOpen}
      >
        {selectedRoom && (
          <RoomDeviceList 
            roomId={selectedRoom.id} 
            roomName={selectedRoom.name}
            projectId={projectId}
          />
        )}
      </Drawer>
    </>
  );
};

export default RoomManager;
