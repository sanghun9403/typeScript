# 🎫Ticketing service

![Main](/assets/images/image.png)

## 프로젝트 목적

> TypeScript가 개발자에게 어떤 이점을 제공하는지 파악합니다.  
> 컴파일러의 개념에 대해서 공부하고 tsc를 어떻게 사용하는지 파악하며 기본 타입의 종류와 사용법을 익힙니다.  
> 기존 Express가 아닌 Nest.js와 TypeScript를 사용하여 과제를 진행했습니다.

## ERD

![ERD](/assets/images/drawSQL-ticket-export-2023-08-03.png)

## API 명세

| Path                     | API Method | Verify |    Description     |
| ------------------------ | :--------: | :----: | :----------------: |
| /signup                  |    POST    |        |      회원가입      |
| /login                   |    POST    |        |       로그인       |
| /users/:id               |    GET     |   ✔    |  유저프로필 조회   |
| /users/:id               |   PATCH    |   ✔    |  유저프로필 수정   |
| /users/:id/reservations  |    GET     |   ✔    | 나의 예약목록 조회 |
| /concerts                |    GET     |        |   공연목록 조회    |
| /concerts/:id            |    GET     |   ✔    |   공연 상세 조회   |
| /concerts/registration   |    POST    |   ✔    |      공연등록      |
| /concerts/search         |    POST    |   ✔    |     공연 검색      |
| /reservation             |    POST    |   ✔    |     공연 예약      |
| /reservation/:id         |   DELETE   |   ✔    |     예약 취소      |
| /reservation/details/:id |    GET     |   ✔    |   예약 상세조회    |
