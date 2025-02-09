import type { CustomMutationResult } from '../types';

import { useMutation } from '@tanstack/react-query';
import { ROUTES } from '../routes';
import { SetStateAction } from 'react';

export type TextResponse = {
  text: string;
  user: string;
  attachments?: { url: string; contentType: string; title: string }[];
};

type SendMessageMutationProps = {
  text: string;
  agentId: string;
  selectedFile: File | null;
};

type Props = Required<{
  setMessages: (value: SetStateAction<TextResponse[]>) => void;
  setSelectedFile: (value: SetStateAction<File | null>) => void;
}>;

export const useSendMessageMutation = ({
  setMessages,
  setSelectedFile,
}: Props): CustomMutationResult<TextResponse[], SendMessageMutationProps> => {
  const mutation = useMutation({
    mutationFn: async ({ text, agentId, selectedFile }: SendMessageMutationProps) => {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('userId', 'user');
      formData.append('roomId', `default-room-${agentId}`);

      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const url = ROUTES.sendMessage(agentId);
      console.log('请求URL:', url);

      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('API错误响应:', {
          status: res.status,
          statusText: res.statusText,
          body: text,
        });
        throw new Error(`API请求失败: ${res.status} ${res.statusText}`);
      }

      return res.json() as Promise<TextResponse[]>;
    },
    onSuccess: data => {
      setMessages(prev => [...prev, ...data]);
      setSelectedFile(null);
    },
    onError: error => {
      console.error('[useSendMessageMutation]:', error);
    },
  });

  return mutation;
};
