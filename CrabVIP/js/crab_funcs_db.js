let db = null;

/**
 * Подключение к indexedDb
 * @returns {Promise<boolean>}
 */
async function DBConnect() {
	// Работаем через промис, иначе не успевает создаться бд
	return new Promise((resolve, reject) => {
		const request = indexedDB.open('PEFL', 1);

		request.onupgradeneeded = async function (event) {
			db = event.target.result;

			await createObjetStores(['teams', 'players', 'divs']);

			console.log('IndexedDB init!');
		}

		// Обработчик на успешное соединение
		request.onsuccess = function (event) {
			db = event.target.result;
			console.log("IndexedDB open!");
			resolve(db);
		}

		// Обработчик на ошибку
		request.onerror = function (event) {
			console.log('Problem with opening DB. Go to CRAB VIP forum!');
			reject('IndexedDB error connect!');
		}
	});
}

async function createObjetStores(storeNames) {
	return new Promise((resolve, reject) => {
		if (!db) {
			reject('IndexedDB not connected!');
		}

		storeNames.forEach((storeName) => {
			// Если хранилище было -> удаляем его
			if (db.objectStoreNames.contains(storeName)) {
				db.deleteObjectStore(storeName);
			}

			// Создаем новое (пустое) хранилище
			let objectStore = db.createObjectStore(storeName, {keyPath: 'id'});
			objectStore.transaction.oncomplete = function () {
				Std.debug("All objectStores has created.");
			}
		});

		resolve(true);
	});
}

/**
 * Добавление объекта в переданную таблицу.
 * Если по такому ключу уже был какой то объект -> перезапись.
 *
 * @param storeName Название store (таблицы)
 * @param object
 * @returns {Promise<unknown>}
 */
async function addObject(storeName, object) {
	return new Promise((resolve, reject) => {
		if (!db) {
			reject('IndexedDB not connected!');
		}

		// Создаем транзакцию на наше хранилище
		const transaction = db.transaction(storeName, 'readwrite');
		// Получаем хранилище для работы с ним
		const table = transaction.objectStore(storeName);

		table.put(object);
		transaction.oncomplete = () => {
			resolve(true); // success
		};

		transaction.onerror = () => {
			reject(transaction.error); // failure
		};
	});
}

/**
 * Сохранение значения по его переданному имени в таблице
 * @param storeName
 * @param name
 * @param val
 * @returns {Promise<unknown>}
 */
async function setByName(storeName, name, val) {
	return new Promise((resolve, reject) => {
		if (!db) {
			reject('IndexedDB not connected!');
		}

		// Создаем транзакцию на наше хранилище
		const transaction = db.transaction(storeName, 'readwrite');
		// Получаем хранилище для работы с ним
		const table = transaction.objectStore(storeName);

		table.put(val, name);
		transaction.oncomplete = () => {
			resolve(true); // success
		};

		transaction.onerror = () => {
			reject(transaction.error); // failure
		};
	});
}

/**
 * Получение всех записей в таблице
 * @param storeName
 * @returns {Promise<unknown>}
 */
async function getAll(storeName) {
	return new Promise((resolve, reject) => {
		if (!db) {
			reject('IndexedDB not connected!');
		}

		// Создаем транзакцию на наше хранилище
		const transaction = db.transaction(storeName, 'readonly');
		// Получаем хранилище для работы с ним
		const table = transaction.objectStore(storeName);

		const request = table.getAll();
		request.onsuccess = () => {
			resolve(request.result); // success
		};

		request.onerror = () => {
			reject(request.error); // failure
		};
	});
}

/**
 * Получение объекта по его ключу в переданной таблице
 *
 * @param storeName Название store (таблицы)
 * @param key
 * @returns {Promise<unknown>}
 */
async function getByKey(storeName, key) {
	return new Promise((resolve, reject) => {
		if (!db) {
			reject('IndexedDB not connected!');
		}

		// Создаем транзакцию на наше хранилище
		const transaction = db.transaction(storeName, 'readonly');
		// Получаем хранилище для работы с ним
		const table = transaction.objectStore(storeName);

		const request = table.get(key);
		request.onsuccess = () => {
			resolve(request.result); // success
		};

		request.onerror = () => {
			reject(request.error); // failure
		};
	});
}
