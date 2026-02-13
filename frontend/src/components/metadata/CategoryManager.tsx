import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Popconfirm, message, Modal, Form, Input, Select, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { categoryService, tradeService } from '../../services';
import type * as Types from '../../types';

interface CategoryManagerProps {
  projectId: string;
}

interface CategoryWithTrade extends Types.Category {
  trade?: { name: string; code?: string };
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ projectId }) => {
  const [categories, setCategories] = useState<CategoryWithTrade[]>([]);
  const [trades, setTrades] = useState<Types.Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Types.Category | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, tradesData] = await Promise.all([
        categoryService.getByProject(projectId),
        tradeService.getByProject(projectId)
      ]);
      setCategories(categoriesData);
      setTrades(tradesData);
    } catch (error) {
      message.error('Fehler beim Laden der Kategorien');
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (category: Types.Category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingCategory) {
        await categoryService.update(editingCategory.id, values);
        message.success('Kategorie aktualisiert');
      } else {
        await categoryService.create(values);
        message.success('Kategorie erstellt');
      }

      setIsModalOpen(false);
      setEditingCategory(null);
      loadData();
    } catch (error) {
      if (error instanceof Error && 'errorFields' in error) {
        return;
      }
      message.error('Fehler beim Speichern der Kategorie');
      console.error('Failed to save category:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryService.delete(id);
      message.success('Kategorie gelöscht');
      loadData();
    } catch (error) {
      message.error('Fehler beim Löschen der Kategorie');
      console.error('Failed to delete category:', error);
    }
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: '15%',
      sorter: (a: CategoryWithTrade, b: CategoryWithTrade) => 
        (a.code || '').localeCompare(b.code || ''),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '35%',
      sorter: (a: CategoryWithTrade, b: CategoryWithTrade) => 
        a.name.localeCompare(b.name),
    },
    {
      title: 'Gewerk',
      dataIndex: ['trade', 'name'],
      key: 'trade',
      width: '25%',
      render: (_: any, record: CategoryWithTrade) => {
        if (record.trade) {
          return record.trade.code 
            ? `${record.trade.code} - ${record.trade.name}` 
            : record.trade.name;
        }
        return '-';
      },
      sorter: (a: CategoryWithTrade, b: CategoryWithTrade) => 
        (a.trade?.name || '').localeCompare(b.trade?.name || ''),
    },
    {
      title: 'Sortierung',
      dataIndex: 'order',
      key: 'order',
      width: '10%',
      sorter: (a: CategoryWithTrade, b: CategoryWithTrade) => 
        a.order - b.order,
    },
    {
      title: 'Aktionen',
      key: 'actions',
      width: '15%',
      render: (_: any, record: Types.Category) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Kategorie löschen?"
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
        title="Kategorien"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Neue Kategorie
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (total) => `${total} Kategorien` }}
        />
      </Card>

      <Modal
        title={editingCategory ? 'Kategorie bearbeiten' : 'Neue Kategorie'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        okText="Speichern"
        cancelText="Abbrechen"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="tradeId"
            label="Gewerk"
            rules={[{ required: true, message: 'Bitte Gewerk auswählen' }]}
          >
            <Select placeholder="Gewerk auswählen">
              {trades.map(trade => (
                <Select.Option key={trade.id} value={trade.id}>
                  {trade.code ? `${trade.code} - ${trade.name}` : trade.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="code"
            label="Code"
          >
            <Input placeholder="z.B. BE1, SD2" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Bitte Namen eingeben' }]}
          >
            <Input placeholder="Name der Kategorie" />
          </Form.Item>

          <Form.Item
            name="order"
            label="Sortierung"
            initialValue={0}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CategoryManager;
