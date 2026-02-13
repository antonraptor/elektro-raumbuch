import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { projectService } from '../../services';
import type * as Types from '../../types';

interface ProjectFormProps {
  open: boolean;
  project: Types.Project | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ open, project, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (open) {
      if (project) {
        form.setFieldsValue(project);
      } else {
        form.resetFields();
      }
    }
  }, [open, project, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (project) {
        await projectService.update(project.id, values);
        message.success('Projekt aktualisiert');
      } else {
        await projectService.create(values);
        message.success('Projekt erstellt');
      }

      onSuccess();
    } catch (error) {
      if (error instanceof Error && 'errorFields' in error) {
        // Form validation error
        return;
      }
      message.error('Fehler beim Speichern des Projekts');
      console.error('Failed to save project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={project ? 'Projekt bearbeiten' : 'Neues Projekt'}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Speichern"
      cancelText="Abbrechen"
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="name"
          label="Projektname"
          rules={[{ required: true, message: 'Bitte Projektname eingeben' }]}
        >
          <Input placeholder="z.B. Casa Singer" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Beschreibung"
        >
          <Input.TextArea rows={3} placeholder="Projektbeschreibung" />
        </Form.Item>

        <Form.Item
          name="client"
          label="Kunde"
        >
          <Input placeholder="Kundenname" />
        </Form.Item>

        <Form.Item
          name="location"
          label="Standort"
        >
          <Input placeholder="Adresse oder Ort" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProjectForm;
