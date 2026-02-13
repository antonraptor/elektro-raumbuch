import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { deviceService, tradeService, categoryService } from '../../services';
import type * as Types from '../../types';

interface DeviceFormProps {
  open: boolean;
  device: Types.Device | null;
  projectId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const DeviceForm: React.FC<DeviceFormProps> = ({ open, device, projectId, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [trades, setTrades] = useState<Types.Trade[]>([]);
  const [categories, setCategories] = useState<Types.Category[]>([]);
  const [selectedTradeId, setSelectedTradeId] = useState<string | undefined>();

  useEffect(() => {
    if (open && projectId) {
      loadTrades();
    }
  }, [open, projectId]);

  useEffect(() => {
    if (open && device) {
      form.setFieldsValue(device);
      if (device.tradeId) {
        setSelectedTradeId(device.tradeId);
        loadCategories(device.tradeId);
      }
    } else if (open) {
      form.resetFields();
      setSelectedTradeId(undefined);
      setCategories([]);
    }
  }, [open, device, form]);

  const loadTrades = async () => {
    try {
      const data = await tradeService.getByProject(projectId);
      setTrades(data);
    } catch (error) {
      console.error('Failed to load trades:', error);
    }
  };

  const loadCategories = async (tradeId: string) => {
    try {
      const data = await categoryService.getByTrade(tradeId);
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories([]);
    }
  };

  const handleTradeChange = (tradeId: string) => {
    setSelectedTradeId(tradeId);
    form.setFieldValue('categoryId', undefined);
    if (tradeId) {
      loadCategories(tradeId);
    } else {
      setCategories([]);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (device) {
        await deviceService.update(device.id, values);
        message.success('Gerät aktualisiert');
      } else {
        await deviceService.create({
          projectId,
          ...values,
        });
        message.success('Gerät erstellt');
      }

      onSuccess();
    } catch (error) {
      if (error instanceof Error && 'errorFields' in error) {
        return;
      }
      message.error('Fehler beim Speichern des Geräts');
      console.error('Failed to save device:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={device ? 'Gerät bearbeiten' : 'Neues Gerät'}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Speichern"
      cancelText="Abbrechen"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="name"
          label="Gerätename"
          rules={[{ required: true, message: 'Bitte Gerätename eingeben' }]}
        >
          <Input placeholder="z.B. Steckdose, Schalter, Leuchte" />
        </Form.Item>

        <Form.Item
          name="code"
          label="Code"
        >
          <Input placeholder="z.B. SD, SCH, LT" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Beschreibung"
        >
          <Input.TextArea rows={3} placeholder="Gerätebeschreibung" />
        </Form.Item>

        <Form.Item
          name="tradeId"
          label="Gewerk"
        >
          <Select
            placeholder="Gewerk auswählen"
            allowClear
            onChange={handleTradeChange}
          >
            {trades.map(trade => (
              <Select.Option key={trade.id} value={trade.id}>
                {trade.code ? `${trade.code} - ${trade.name}` : trade.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="Kategorie"
        >
          <Select
            placeholder="Kategorie auswählen"
            allowClear
            disabled={!selectedTradeId}
          >
            {categories.map(category => (
              <Select.Option key={category.id} value={category.id}>
                {category.code ? `${category.code} - ${category.name}` : category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DeviceForm;
