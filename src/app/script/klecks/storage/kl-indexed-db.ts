import { IndexedDb } from '../../bb/base/indexed-db';

let dbName = 'Klecks';
export function setKlIndexedDbName(name: string): void {
    dbName = name;
}
export function getKlIndexedDbName(): string {
    return dbName;
}

export const RECOVERY_STORE = 'RecoveryStore'; // key is string
export const IMAGE_DATA_STORE = 'ImageDataStore'; // key is string
export const BROWSER_STORAGE_STORE = 'ProjectStore'; // key is number
export const CURRICULUM_STORE = 'CurriculumStore'; // key is string (sessionId)
export const KL_INDEXED_DB_STORES = [RECOVERY_STORE, IMAGE_DATA_STORE, BROWSER_STORAGE_STORE, CURRICULUM_STORE];
export const KL_INDEXED_DB_VERSION = 3;
export const KL_INDEXED_DB_UPGRADER = (event: IDBVersionChangeEvent) => {
    const oldVersion = event.oldVersion;
    const db = (event.target as IDBOpenDBRequest).result;
    if (oldVersion < 1) {
        const store = db.createObjectStore(BROWSER_STORAGE_STORE, {
            keyPath: 'id',
        });
        store.createIndex('id', 'id', { unique: true });
    }
    if (oldVersion < 2) {
        db.createObjectStore(IMAGE_DATA_STORE);
        db.createObjectStore(RECOVERY_STORE);
    }
    if (oldVersion < 3) {
        db.createObjectStore(CURRICULUM_STORE);
    }
};

export const KL_INDEXED_DB = new IndexedDb({});
