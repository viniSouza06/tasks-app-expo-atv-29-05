import axios from 'axios';
import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

export interface TaskItem {
  _id: string;
  text: string;
  completed?: boolean;
  dueDate?: string;
}

const getHeaders = () => {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllTasks = (setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>, setLoading?: React.Dispatch<React.SetStateAction<boolean>>) => {
  if (setLoading) setLoading(true);
  axios.get<TaskItem[]>(`${baseURL}`, { headers: getHeaders() }).then(({ data }) => {
    setTasks(data);
    if (setLoading) setLoading(false);
  }).catch((err) => {
    console.log(err);
    if (setLoading) setLoading(false);
  });
};

export const addTask = (
  text: string,
  completed: boolean,
  dueDate: string | null,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  onSuccess: () => void
) => {
  axios
    .post(`${baseURL}/save`, { text, completed, dueDate }, { headers: getHeaders() })
    .then(() => {
      onSuccess();
      getAllTasks(setTasks);
    })
    .catch((err) => console.log(err));
};

export const updateTask = (
  taskId: string,
  text: string,
  completed: boolean,
  dueDate: string | null,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  onSuccess: () => void
) => {
  axios
    .post(`${baseURL}/update`, { _id: taskId, text, completed, dueDate }, { headers: getHeaders() })
    .then(() => {
      onSuccess();
      getAllTasks(setTasks);
    })
    .catch((err) => console.log(err));
};

export const deleteTask = (
  _id: string,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>
) => {
  axios
    .post(`${baseURL}/delete`, { _id }, { headers: getHeaders() })
    .then(() => {
      getAllTasks(setTasks);
    })
    .catch((err) => console.log(err));
};
