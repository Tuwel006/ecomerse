import api from './api';

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/media/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getMediaLibrary = async () => {
    const response = await api.get('/media');
    return response.data;
};
