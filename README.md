## 테스트 계정

직접 회원가입이 번거로우시면, 아래 테스트 계정을 사용해 로그인하실 수 있습니다.  

📌 **테스트 계정 정보**  
- **이메일**: `test@test.com`  
- **비밀번호**: `test`  

## 시연 페이지

[Live Demo](https://merntodo-bd76.onrender.com/)

---

## 프로젝트 소개

<p>MERN 스택(Node.js, Express, React, MongoDB)을 활용하여 개발한 풀스택 Todo 웹 애플리케이션입니다.</p>
<p>JWT와 Zustand를 이용해 액세스 토큰 및 리프레시 토큰을 통한 로그인 유지와 API 접근 제한을 구현하였으며,  
Google OAuth 2.0을 통한 소셜 로그인도 지원합니다.  </p>

---

## 기술 스택

| JavaScript | TypeScript |  React   | Node.js |  Express   | MongoDB  |
| :--------: | :--------: | :------: | :-----: | :--------: | :------: |
|   ![js]    |   ![ts]    | ![react] | ![node] | ![express] | ![mongo] |

---

## 주요 기능

### 1. JWT 인증 및 API 접근 제한

-   JWT + 리프레시 토큰을 사용하여 로그인 유지 기능을 구현하였습니다.
-   Google OAuth 2.0을 활용한 소셜 로그인 기능을 지원합니다.
-   Zustand를 이용해 인증 상태를 전역적으로 관리합니다.

### 2. Todo CRUD API

-   Express + MongoDB(Mongoose)를 이용해 CRUD 기능을 구현하였습니다.
-   API 요청은 JWT 인증이 필요하도록 설정하였습니다.

### 3. 상태 관리

-   Zustand를 사용하여 Todo 상태를 전역으로 관리합니다.

<!-- Stack Icon References -->

[js]: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg
[ts]: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg
[react]: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg
[node]: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg
[express]: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg
[mongo]: https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg
