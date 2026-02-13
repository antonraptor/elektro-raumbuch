import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Popconfirm, message, Modal, Form, Input, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type * as Types from '../../types';

interface MetadataItem {
  id: string;
  name: string;
  code?: string;
  order?: number;
}

interface MetadataManagerProps {
  title: string;
  projectId: string;
  getData: (projectId: string) => Promise<MetadataItem[]>;
  createData: (data: any) => Promise<MetadataItem>;
  updateData: (id: string, data: any) => Promise<MetadataItem>;
  deleteData: (id: string) => Promise<void>;
  showCode?: boolean;
  showOrder?: boolean;
  additionalFields?: Array<{
    name: string;
    label: string;
    type: 'text' | 'number';
    required?: boolean;
  }>;
}

const MetadataManager: React.FC<MetadataManagerProps> = ({
  title,
  projectId,
  getData,
  createData,
  updateData,
  deleteData,
  showCode = true,
  showOrder = true,
  additionalFields = []
}) => {
  const [items, setItems] = useState<MetadataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MetadataItem | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getData(projectId);
      setItems(data);
    } catch (error) {
      message.error(`Fehler beim Laden der ${title}`);
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({ 
      code: '',
      order: items.length 
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: MetadataItem) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingItem) {
        await updateData(editingItem.id, values);
        message.success(`${title} aktualisiert`);
      } else {
        await createData({
          projectId,
          ...values,
        });
        message.success(`${title} erstellt`);
      }

      setIsModalOpen(false);
      setEditingItem(null);
      loadData();
    } catch (error) {
      if (error instanceof Error && 'errorFields' in error) {
        return;
      }
      message.error(`Fehler beim Speichern`);
      console.error('Failed to save:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteData(id);
      message.success(`${title} gelöscht`);
      loadData();
    } catch (error) {
      message.error(`Fehler beim Löschen`);
      console.error('Failed to delete:', error);
    }
  };

  const columns = [
    showCode && {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: '15%',
      sorter: (a: MetadataItem, b: MetadataItem) => 
        (a.code || '').localeCompare(b.code || ''),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: showOrder ? '55%' : '70%',
      sorter: (a: MetadataItem, b: MetadataItem) => 
        a.name.localeCompare(b.name),
    },
    showOrder && {
      title: 'Sortierung',
      dataIndex: 'order',
      key: 'order',
      width: '15%',
      sorter: (a: MetadataItem, b: MetadataItem) => 
        (a.order ?? 0) - (b.order ?? 0),
    },
    {
      title: 'Aktionen',
      key: 'actions',
      width: '15%',
      render: (_: any, record: MetadataItem) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title={`${title} löschen?`}
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
  ].filter(Boolean);

  return (
    <>
      <Card
        title={title}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Neu
          </Button>
        }
      >
        <Table
          columns={columns as any}
          dataSource={items}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (total) => `${total} Einträge` }}
        />
      </Card>

      <Modal
        title={editingItem ? `${title} bearbeiten` : `Neuer ${title}`}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        okText="Speichern"
        cancelText="Abbrechen"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          {showCode && (
            <Form.Item
              name="code"
              label="Code"
            >
              <Input placeholder="z.B. EL, SA, BE" />
            </Form.Item>
          )}

          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Bitte Namen eingeben' }]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          {additionalFields.map(field => (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              rules={field.required ? [{ required: true, message: `Bitte ${field.label} eingeben` }] : []}
            >
              {field.type === 'number' ? (
                <InputNumber style={{ width: '100%' }} />
              ) : (
                <Input />
              )}
            </Form.Item>
          ))}

          {showOrder && (
            <Form.Item
              name="order"
              label="Sortierung"
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default MetadataManager;
