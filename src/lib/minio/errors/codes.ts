export type MinioErrorCode = 'invalid_credentials' | 'file_type_not_allowed' | 'file_size_not_allowed' | 'file_not_found' | 'file_is_required' | 'unable_to_delete' | 'unable_to_upload';

export type MinioErrorResponse = {
    code: MinioErrorCode;
    description?: string;
    status: number;
};