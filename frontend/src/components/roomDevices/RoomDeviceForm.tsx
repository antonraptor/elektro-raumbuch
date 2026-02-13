import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { 
  roomDeviceService, 
  deviceService, 
  tradeService, 
  categoryService,
  connectionService,
  installZoneService 
} from '../../services';
import type * as Types from '../../types';

interface RoomDeviceFormProps {
  open: boolean;
  roomDevice: Types.RoomDevice | null;
  roomId: string;
  projectId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const RoomDeviceForm: React.FC<RoomDeviceFormProps> = ({ 
  open, 
  roomDevice, 
  roomId, 
  projectId,
  onSuccess, 
  onCancel 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<Types.Device[]>([]);
  const [trades, setTrades] = useState<Types.Trade[]>([]);
  const [categories, setCategories] = useState<Types.Category[]>([]);
  const [connections, setConnections] = useState<Types.Connection[]>([]);
  const [installZones, setInstallZones] = useState<Types.InstallZone[]>([]);
  const [selectedTradeId, setSelectedTradeId] = useState<string | undefined>();

  useEffect(() => {
    if (open && projectId) {
      loadMetadata();
    }
  }, [open, projectId]);

  useEffect(() => {
    if (open && roomDevice) {
      form.setFieldsValue(roomDevice);
      if (roomDevice.tradeId) {
        setSelectedTradeId(roomDevice.tradeId);
        loadCategories(roomDevice.tradeId);
      }
    } else if (open) {
      form.resetFields();
      form.setFieldsValue({ quantity: 1 });
      setSelectedTradeId(undefined);
      setCategories([]);
    }
  }, [open, roomDevice, form]);

  const loadMetadata = async () => {
    try {
      const [devicesData, tradesData, connectionsData, installZonesData] = await Promise.all([
        deviceService.getByProject(projectId),
        tradeService.getByProject(projectId),
        connectionService.getByProject(projectId),
        installZoneService.getByProject(projectId)
      ]);
      setDevices(devicesData);
      setTrades(tradesData);
      setConnections(connectionsData);
      setInstallZones(installZonesData);
    } catch (error) {
      console.error('Failed to load metadata:', error);
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

  const handleDeviceChange = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      // Auto-fill fields from device
      form.setFieldsValue({
        designation: device.name,
        code: device.code,
        tradeId: device.tradeId,
        categoryId: device.categoryId
      });
      
      if (device.tradeId) {
        setSelectedTradeId(device.tradeId);
        loadCategories(device.tradeId);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (roomDevice) {
        await roomDeviceService.update(roomDevice.id, values);
        message.success('Gerät aktualisiert');
      } else {
        await roomDeviceService.create({
          roomId,
          ...values,
        });
        message.success('Gerät hinzugefügt');
      }

      onSuccess();
    } catch (error) {
      if (error instanceof Error && 'errorFields' in error) {
        return;
      }
      message.error('Fehler beim Speichern');
      console.error('Failed to save room device:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={roomDevice ? 'Gerät bearbeiten' : 'Gerät hinzufügen'}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Speichern"
      cancelText="Abbrechen"
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="deviceId"
          label="Gerät aus Stammdaten"
        >
          <Select
            placeholder="Optional: Gerät auswählen"
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
            }
            onChange={handleDeviceChange}
          >
            {devices.map(device => (
              <Select.Option key={device.id} value={device.id}>
                {device.code ? `${device.code} - ${device.name}` : device.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="designation"
          label="Bezeichnung"
          rules={[{ required: true, message: 'Bitte Bezeichnung eingeben' }]}
        >
          <Input placeholder="z.B. Deckenleuchte, Steckdose Küche" />
        </Form.Item>

        <Form.Item
          name="code"
          label="Code"
        >
          <Input placeholder="z.B. DL1, SD2" />
        </Form.Item>

        <Form.Item
          name="totalCode"
          label="Gesamtcode"
        >
          <Input placeholder="z.B. EG-01-DL1" />
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

        <Form.Item
          name="connectionId"
          label="Anschluss"
        >
          <Select placeholder="Anschluss auswählen" allowClear>
            {connections.map(connection => (
              <Select.Option key={connection.id} value={connection.id}>
                {connection.code ? `${connection.code} - ${connection.name}` : connection.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="installZoneId"
          label="Installationszone"
        >
          <Select placeholder="Installationszone auswählen" allowClear>
            {installZones.map(zone => (
              <Select.Option key={zone.id} value={zone.id}>
                {zone.code ? `${zone.code} - ${zone.name}` : zone.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="cableType"
          label="Leitungsart"
        >
          <Input placeholder="z.B. NYM 3x1.5" />
        </Form.Item>

        <Form.Item
          name="target"
          label="Ziel"
        >
          <Input placeholder="z.B. UV EG" />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Anzahl"
          initialValue={1}
        >
          <InputNumber style={{ width: '100%' }} min={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoomDeviceForm;
