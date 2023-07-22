# VALUN - *우리동네 자율정화 커뮤니티*
##
> *VALUN 은 2023-2 가천대학교 컴퓨터공학과 졸업 심사를 위해 Express.js, React.js 로 제작한 프로젝트입니다.*
> *이후 2023-동계 P-커리어캐치 프로그램에 참여하여 Nest.js 및 IOS App 으로 Migration 하였습니다.*

VALUN 은 우리 주변에 발생한 문제를 공유하고 자발적으로 해결할 수 있는 기회를 제공하는 공공목적의 커뮤니티 입니다. <br />
제보자가 주변의 문제(Issue)를 인식하고 사진 찍어 업로드하면, AI 를 통해 사진 속 특정 대상 (위험 시설물, 환경 저해요소) 를 감지합니다. <br />
제보된 Issue 는 분류별 일러스트와 함께 지도에 표시되어 다른 사용자가 쉽게 그 종류와 위치를 파악할 수 있도록 제공됩니다. <br />

## Features
- 사진과 GPS 정보를 통한 Issue 제보 및 해결 기능
- Yolo v5 (AI Model) 을 이용한 사진 속 위험 시설물, 환경 저해요소 검출
- [미구현] Issue 제보, 해결을 통해 획득한 포인트를 사용할 수 있는 커뮤니티


## Tech

VALUN 에 사용된 주요 라이브러리 및 프레임워크 입니다.

- [NestJS] - Node.js framework for building server-side application
- [Prisma] - Node.js ORM Library
- [ReactJS] - JS Library for building component based UI
- [FastAPI] - Python framework for building server-side application
- [Yolo v5] - Object detection model

[//]: # (Reference links)
   [NestJS]: <https://nestjs.com/>
   [Prisma]: <https://www.prisma.io/>
   [ReactJS]: <https://react.dev/>
   [FastAPI]: <https://fastapi.tiangolo.com/>
   [Yolo v5]: <https://github.com/ultralytics/yolov5>
