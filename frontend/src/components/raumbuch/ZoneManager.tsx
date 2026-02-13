import React, { useEffect, useState } from 'react';
import { Card, List, Button, Space, Popconfirm, message, Empty, Input, Form } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { zoneService } from '../../services';
import type * as Types from '../../types';

interface ZoneManagerProps {
  projectId: string;
  onSelectZone: (zone: Types.Zone) => void;
  selectedZoneId?: string;
}

const ZoneManager: React.FC<ZoneManagerProps> = ({ projectId, onSelectZone, selectedZoneId }) => {
  const [zones, setZones] = useState<Types.Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (projectId) {
      loadZones();
    }
  }, [projectId]);

  const loadZones = async () => {
    try {
      setLoading(true);
      const data = await zoneService.getByProject(projectId);
      setZones(data);
      
      // Auto-select first zone if none selected
      if (data.length > 0 && !selectedZoneId) {
        onSelectZone(data[0]);
      }
    } catch (error) {
      message.error('Fehler beim Laden der Zonen');
      console.error('Failed to load zones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    form.resetFields();
    form.setFieldsValue({ 
      code: `Z${zones.length + 1}`,
      order: zones.length 
    });
  };

  const handleSaveNew = async () => {
    try {
      const values = await form.validateFields();
      await zoneService.create({
        projectId,
        code: values.code,
        name: values.name,
        order: values.order ?? zones.length,
      });
      message.success('Zone erstellt');
      setIsAdding(false);
      loadZones();
    } catch (error) {
      if (error instanceof Error && 'errorFields' in error) {
        return;
      }
      message.error('Fehler beim Erstellen der Zone');
      console.error('Failed to create zone:', error);
    }
  };

  const handleEdit = (zone: Types.Zone) => {
    setEditingId(zone.id);
    form.setFieldsValue(zone);
  };

  const handleSaveEdit = async (zone: Types.Zone) => {
    try {
      const values = await form.validateFields();
      await zoneService.update(zone.id, values);
      message.success('Zone aktualisiert');
      setEditingId(null);
      loadZones();
    } catch (error) {
      if (error instanceof Error && 'errorFields' in error) {
        return;
      }
      message.error('Fehler beim Aktualisieren der Zone');
      console.error('Failed to update zone:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await zoneService.delete(id);
      message.success('Zone gelöscht');
      loadZones();
    } catch (error) {
      message.error('Fehler beim Löschen der Zone');
      console.error('Failed to delete zone:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    form.resetFields();
  };

  return (
    <Card
      title="Zonen / Geschosse"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} disabled={isAdding}>
          Neue Zone
        </Button>
      }
    >
      {zones.length === 0 && !isAdding ? (
        <Empty description="Keine Zonen vorhanden" />
      ) : (
        <List
          dataSource={zones}
          loading={loading}
          renderItem={(zone) => (
            <List.Item
              style={{
                backgroundColor: zone.id === selectedZoneId ? '#e6f7ff' : 'transparent',
                cursor: 'pointer',
                padding: '12px 16px',
              }}
              onClick={() => zone.id !== editingId && onSelectZone(zone)}
              actions={
                editingId === zone.id
                  ? [
                      <Button
                        key="save"
                        type="primary"
                        size="small"
                        icon={<SaveOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveEdit(zone);
                        }}
                      >
                        Speichern
                      </Button>,
                      <Button
                        key="cancel"
                        size="small"
                        icon={<CloseOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancel();
                        }}
                      >
                        Abbrechen
                      </Button>,
                    ]
                  : [
                      <Button
                        key="edit"
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(zone);
                        }}
                      />,
                      <Popconfirm
                        key="delete"
                        title="Zone löschen?"
                        description="Alle Räume in dieser Zone werden ebenfalls gelöscht."
                        onConfirm={(e) => {
                          e?.stopPropagation();
                          handleDelete(zone.id);
                        }}
                        okText="Ja"
                        cancelText="Nein"
                      >
                        <Button
                          type="link"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Popconfirm>,
                    ]
              }
            >
              {editingId === zone.id ? (
                <div style={{ width: '100%' }} onClick={(e) => e.stopPropagation()}>
                  <Form form={form} layout="inline">
                    <Form.Item
                      name="code"
                      rules={[{ required: true, message: 'Code erforderlich' }]}
                      style={{ marginRight: 8, width: 100 }}
                    >
                      <Input placeholder="Code" />
                    </Form.Item>
                    <Form.Item
                      name="name"
                      rules={[{ required: true, message: 'Name erforderlich' }]}
                      style={{ marginRight: 8, flex: 1 }}
                    >
                      <Input placeholder="Zonenname (z.B. EG, OG, UG)" />
                    </Form.Item>
                    <Form.Item name="order" style={{ width: 80 }}>
                      <Input type="number" placeholder="Nr." />
                    </Form.Item>
                  </Form>
                </div>
              ) : (
                <List.Item.Meta
                  title={`${zone.code} - ${zone.name}`}
                  description={`Sortierung: ${zone.order}`}
                />
              )}
            </List.Item>
          )}
        />
      )}

      {isAdding && (
        <div style={{ padding: '16px', backgroundColor: '#f5f5f5', marginTop: 16, borderRadius: 4 }}>
          <Form form={form} layout="vertical">
            <Form.Item
              name="code"
              label="Code"
              rules={[{ required: true, message: 'Bitte Code eingeben' }]}
            >
              <Input placeholder="z.B. Z1, EG, OG" />
            </Form.Item>
            <Form.Item
              name="name"
              label="Zonenname"
              rules={[{ required: true, message: 'Bitte Zonennamen eingeben' }]}
            >
              <Input placeholder="z.B. Erdgeschoss, Obergeschoss" />
            </Form.Item>
            <Form.Item name="order" label="Sortierung">
              <Input type="number" placeholder="0, 1, 2..." />
            </Form.Item>
            <Space>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveNew}>
                Speichern
              </Button>
              <Button icon={<CloseOutlined />} onClick={handleCancel}>
                Abbrechen
              </Button>
            </Space>
          </Form>
        </div>
      )}
    </Card>
  );
};

export default ZoneManager;
