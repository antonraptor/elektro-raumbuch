import React, { useState } from 'react';
import { Modal, Upload, Form, Input, Button, message, Alert } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { api } from '../../services';

interface ImportModalProps {
  open: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ open, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [importStats, setImportStats] = useState<any>(null);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (fileList.length === 0) {
        message.error('Bitte wählen Sie eine Excel-Datei aus');
        return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append('file', fileList[0] as any);
      formData.append('projectName', values.projectName);
      if (values.description) {
        formData.append('description', values.description);
      }

      const response = await api.post('/import/excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setImportStats(response.data.stats);
      message.success('Excel-Datei erfolgreich importiert!');
      
      // Wait a bit to show stats, then close and refresh
      setTimeout(() => {
        setFileList([]);
        setImportStats(null);
        form.resetFields();
        onSuccess();
      }, 3000);

    } catch (error: any) {
      console.error('Import error:', error);
      const errorMessage = error.response?.data?.message || 'Fehler beim Import der Excel-Datei';
      message.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFileList([]);
    setImportStats(null);
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Excel-Datei importieren"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={uploading}
      okText="Importieren"
      cancelText="Abbrechen"
      width={600}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="projectName"
          label="Projektname"
          rules={[{ required: true, message: 'Bitte Projektname eingeben' }]}
        >
          <Input placeholder="z.B. Casa Singer" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Beschreibung"
        >
          <Input.TextArea rows={2} placeholder="Optional" />
        </Form.Item>

        <Form.Item label="Excel-Datei">
          <Upload.Dragger
            fileList={fileList}
            beforeUpload={(file) => {
              const isExcel = 
                file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'application/vnd.ms-excel' ||
                file.name.endsWith('.xlsx') ||
                file.name.endsWith('.xls') ||
                file.name.endsWith('.xlsm');
              
              if (!isExcel) {
                message.error('Nur Excel-Dateien (.xlsx, .xls, .xlsm) sind erlaubt');
                return false;
              }
              
              setFileList([file]);
              return false; // Prevent auto upload
            }}
            onRemove={() => {
              setFileList([]);
            }}
            maxCount={1}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Klicken oder Datei hierher ziehen
            </p>
            <p className="ant-upload-hint">
              Excel-Datei (.xlsx, .xls, .xlsm) mit "Raumbuch"-Arbeitsblatt
            </p>
          </Upload.Dragger>
        </Form.Item>

        {importStats && (
          <Alert
            message="Import erfolgreich!"
            description={
              <div>
                <p>Die folgenden Daten wurden importiert:</p>
                <ul>
                  <li>Zonen: {importStats.zones}</li>
                  <li>Räume: {importStats.rooms}</li>
                  <li>Geräte: {importStats.devices}</li>
                  <li>Gewerke: {importStats.trades}</li>
                  <li>Kategorien: {importStats.categories}</li>
                  <li>Verbindungen: {importStats.connections}</li>
                  <li>Installationszonen: {importStats.installZones}</li>
                </ul>
              </div>
            }
            type="success"
            showIcon
          />
        )}
      </Form>
    </Modal>
  );
};

export default ImportModal;
