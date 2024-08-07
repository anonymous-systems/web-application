import { FullMetadata } from '@angular/fire/storage';
export interface StorageFile extends FullMetadata {
    name: string;
    type: 'file';
    size: number;
    updated: string;
    uploading?: boolean;
    timeCreated: string;
    fullPath: string;
}
