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

## Problems

```javascript
// concerts.service.ts 공연등록
 const savedConcert = await this.concertRepository.save(newConcert);
    try {
      await this.seatService.createSeats(savedConcert, maxSeats);

      return savedConcert;
    } catch (err) {
      await this.concertRepository.delete(savedConcert.id);
      throw err;
    }
```
```javascript
// seats.service.ts 좌석생성
 async createSeats(concert: Concert, maxSeats: number) {
    try {
      // 트랜잭션 사용을 위해 entityManeger 사용
      const entityManager = this.seatRepository.manager;

      // 좌석의 등급 비율을 2:3:5로 설정
      const seatRatio = { S: 2, A: 3, B: 5 };

      const totalRatio = seatRatio.S + seatRatio.A + seatRatio.B;

      // maxSeats에 따라 각 좌석의 개수 계산
      const ratioCaculate = {
        S: Math.floor((seatRatio.S / totalRatio) * maxSeats),
        A: Math.floor((seatRatio.A / totalRatio) * maxSeats),
        B: Math.floor((seatRatio.B / totalRatio) * maxSeats),
      };

      const seatList = [];

      for (const [grade, number] of Object.entries(ratioCaculate)) {
        for (let i = 1; i <= number; i++) {
          const seat = new Seat();
          seat.seatNumber = i;
          seat.grade = grade;
          seat.price = this.seatPriceByGrade(grade);
          seat.status = false;
          seat.concert = concert;
          seatList.push(seat);
        }
      }

      await entityManager.transaction(async (transactionEntityManger: EntityManager) => {
        await transactionEntityManger.save(Seat, seatList);
      });
    } catch (err) {
      throw err;
    }
  }
```
유저에게 입력받은 createConcertDto를 통해 좌석의 등급, 가격, 비율을 입력받아 트랜잭션을 통해 콘서트 등록 시 좌석을 자동 생성하는 것까지 구현했으나 아래의 현재 좌석의 예약가능 유무를 출력해주는 부분에서 어려움이 있었음. 시간을 투자하면 해결 가능 할 것으로 예상되지만 과제 제출까지 얼마 남지 않아 시간관계/작업 편의상 고정값을 넣어둠.  
공연 등록 시 유저가 입력한 maxSeats의 수량을 토대로 설정해 둔 비율에 따라 좌석이 자동 생성되는 구조.
```javascript
// concerts.service.ts 공연 상세 조회
async getConcertDetail(id: number) {
    try {
      const getConcert = await this.concertRepository.findOne({
        where: { id },
        select: [
          "id",
          "title",
          "concertImage",
          "description",
          "concertTime",
          "concertCategory",
          "location",
          "maxSeats",
        ],
      });

      const availableSeats = await this.seatService.checkSeatStatus(getConcert.id);
      const seatInfos = [
        { grade: "S", availableSeats: 0, price: 50000 },
        { grade: "A", availableSeats: 0, price: 30000 },
        { grade: "B", availableSeats: 0, price: 10000 },
      ];

      for (const seat of availableSeats) {
        if (seat.grade === "S") seatInfos[0].availableSeats++;
        else if (seat.grade === "A") seatInfos[1].availableSeats++;
        else if (seat.grade === "B") seatInfos[2].availableSeats++;
      }

      return { ...getConcert, seatInfos };
    } catch (err) {
      throw err;
    }
  }
```
```javascript
// 출력결과
{
  "id": 40,
  "title": "테스트 공연3(좌석자동)",
  "concertImage": "https://c6967864-e9db-49ed-a2cc-ee60d2b00d47.png",
  "description": "테스트공연",
  "concertTime": "2023-07-30T15:00:00.000Z",
  "concertCategory": "액션",
  "location": "잠실 sk 핸드볼경기장",
  "maxSeats": 50,
  "seatInfos": [
    {
      "grade": "S",
      "availableSeats": 0,
      "price": 50000
    },
    {
      "grade": "A",
      "availableSeats": 3,
      "price": 30000
    },
    {
      "grade": "B",
      "availableSeats": 11,
      "price": 10000
    }
  ]
}
```
이외에도 짜잘한 타입오류나 Nest.js를 처음 사용하다 보니 초기 세팅을 할 때 어려움이 많이 있었음.  
SOLID원칙을 생각하면서 객체지향설계를 해보려 했으나 생각대로 잘 되지 않았고, 사실 Nest.js를 제대로 활용하지 못했다고 생각되어서 추가적인 공부가 필요할 것으로 보임.
