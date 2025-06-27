1.У теці Node-image скопійован файл Dockerfile з custom-node-base репозітория урока.
Він використан в якості базового іміджа в redis-like/Dockerfile і розміщен в
Docker hub:  

 https://hub.docker.com/repository/docker/dendmik/node-base/general

2.redis-like Dockerfile згенерован за допомогою deep-seek, тому що в базовому образі 
dendmik/node-base:latest задіян пользователь node і його власна діректорія /app.

3.Dockerfile.kv.dev зроблен з hot-reload але він не виконує fetch.

4.Не вдалось назвати multi-stage докерфайл ім'ям Dockerfile.kv тому що 
 docker-compose відмовляется й'ого виконувати з таким ім'ям , тому він просто
 Dockerfile.

5.Запити робив в Postman:

 http://localhost:8080/kv/ method POST
 body  
  {
    "key":"Katy",
    "value":"white"
}
зберігає в MAP store.

6.Запит:

 http://localhost:8080/kv/Katy method GET отримуе у відповідь
{
    "value":"white"
}
