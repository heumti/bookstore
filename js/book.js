
        async function fetchBooks(query) {
            const REST_API_KEY = "d18f434b8312735910e3f93ea885a651";
            const params = new URLSearchParams({
                target: "title",
                query,
                size: 9
            });
            const url = `https://dapi.kakao.com/v3/search/book?${params}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization:  `KakaoAK ${REST_API_KEY}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP 오류: ${response.status}`);
            }

            return response.json();
        }

        async function bookData() {
            try {
                
                const queries = [
                    { query: "바이브코딩", sectionId: "section1" },
                    { query: "오디세이", sectionId: "section2" }
                ];

                for (const { query, sectionId } of queries) {
                    const data = await fetchBooks(query);

                    // 해당 섹션 내의 .box 요소 8개 선택
                    const section = document.querySelector(`#${sectionId}`);
                    const boxElements = section.querySelectorAll(".book1, .book2" );

                    boxElements.forEach((box, i) => {
                        const doc = data.documents[i];
                        if (!doc) return;

                       
                        box.innerHTML = `<img src="${doc.thumbnail}">
                        <h3>${doc.title}</h3>
                        <h6>${doc.authors}<h6>
                        <p>${doc.contents.substring(0,0)}</p>
                       
                        `
                    });
                }
            } catch (error) {
                console.error('에러 발생:', error);
            }
        }

        async function loadBestBooks() {
            try {
                
                const REST_API_KEY = "d18f434b8312735910e3f93ea885a651";
                const params = new URLSearchParams({
                    target: "title",
                    query: "베스트셀러", 
                    size: 15 
                });
                const url = `https://dapi.kakao.com/v3/search/book?${params}`;
                const response = await fetch(url, { headers: { Authorization: `KakaoAK ${REST_API_KEY}` } });
                const data = await response.json();
                
                const wrapper = document.getElementById('best-wrapper');
                let htmlString = "";
                
               
                for(let i = 0; i < data.documents.length; i += 3) {
                    const chunk = data.documents.slice(i, i + 3); // 3권 자르기
                    
                    htmlString += `<div class="swiper-slide list-slide">`;
                    
                   
                    chunk.forEach((doc, idx) => {
                        const rank = i + idx + 1; 
                        const thumbnail = doc.thumbnail ? doc.thumbnail : "https://placehold.co/70x100/e2e8f0/94a3b8?text=No+Img";
                        
                       
                        const mockRating = (Math.random() * 1 + 4).toFixed(1); 
                        const mockReview = Math.floor(Math.random() * 500) + 50;

                        htmlString += `
                            <div class="list-item" onclick="window.open('${doc.url}')">
                                <img src="${thumbnail}" alt="표지">
                                <div class="list-rank">${rank}</div>
                                <div class="list-info">
                                    <h3>${doc.title}</h3>
                                    <p>${doc.authors.join(', ')}</p>
                                    <div class="list-rating">★${mockRating} <span>(${mockReview})</span></div>
                                </div>
                            </div>
                        `;
                    });
                    htmlString += `</div>`;
                }
                
               
                wrapper.innerHTML = htmlString;
                
                
                new Swiper('.mySwiper3', {
                    slidesPerView: 1, // 
                    spaceBetween: 20,
                    navigation: { nextEl: '.next3', prevEl: '.prev3' },
                    breakpoints: {
                        768: { slidesPerView: 2, spaceBetween: 20 }, 
                        1024: { slidesPerView: 3, spaceBetween: 30 } // 
                    }
                });

            } catch (error) {
                console.error('베스트 데이터 에러:', error);
            }
        }
        bookData();
        loadBestBooks();
        async function loadNewBestBooks() {
    try {
        const REST_API_KEY = "d18f434b8312735910e3f93ea885a651"; 
        const params = new URLSearchParams({
            target: "author",
            query: "하라리", // 검색어
            size: 27 // 3권씩 묶어서 9개의 슬라이드(총 27권) 생성
        });
        const url = `https://dapi.kakao.com/v3/search/book?${params}`;
        
        const response = await fetch(url, { headers: { Authorization: `KakaoAK ${REST_API_KEY}` } });
        const data = await response.json();
        
        const wrapper = document.getElementById('new-best-wrapper');
        let htmlString = "";
        
        // 🚨 핵심: 데이터를 3개씩 잘라서(chunk) 하나의 슬라이드(기둥)로 만듭니다
        for(let i = 0; i < data.documents.length; i += 3) {
            const chunk = data.documents.slice(i, i + 3);
            htmlString += `<div class="swiper-slide list-slide">`;
            
            chunk.forEach((doc, idx) => {
                const rank = i + idx + 1;
                const thumbnail = doc.thumbnail ? doc.thumbnail : "https://placehold.co/60x86?text=No+Img";
                
                // 가짜 별점 및 리뷰 수 생성
                const mockRating = (Math.random() * 1 + 4).toFixed(1); 
                const mockReview = Math.floor(Math.random() * 1000) + 50;

                htmlString += `
                    <div class="list-item" onclick="window.open('${doc.url}')">
                        <div class="item-img-box">
                            <img src="${thumbnail}" alt="표지">
                        </div>
                        <div class="list-rank">${rank}</div>
                        <div class="list-info">
                            <h3>${doc.title}</h3>
                            <p>${doc.authors.join(', ')}</p>
                            <div class="list-rating">
                                <span class="star">★</span>
                                <span class="score">${mockRating}</span>
                                <span class="count">(${mockReview})</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            htmlString += `</div>`;
        }
        
        wrapper.innerHTML = htmlString;
        
        // Swiper 슬라이더 활성화
        new Swiper('.mySwiper5', {
            slidesPerView: 1, // 모바일에서는 한 번에 1개(3권 묶음) 보임
            spaceBetween: 20,
            navigation: { nextEl: '.next5', prevEl: '.prev5' },
            breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 30 } // PC에서는 한 번에 3개(9권) 보임
            }
        });

    } catch (error) {
        console.error('베스트 데이터 불러오기 에러:', error);
    }
}

// 스크립트 맨 아래에서 함수 실행 잊지 마세요!
loadNewBestBooks();

// 사업자 정보 토글 기능
const companyBtn = document.getElementById('companyBtn');
const companyContent = document.getElementById('companyContent');

// 버튼이 화면에 존재하는지 확인 후 실행 (에러 방지)
if (companyBtn && companyContent) {
    companyBtn.addEventListener('click', () => {
        // 1. 버튼에 'open' 클래스 추가/제거 (화살표 방향 변경용)
        companyBtn.classList.toggle('open');
        
        // 2. 내용에 'show' 클래스 추가/제거 (display: block으로 변경)
        companyContent.classList.toggle('show');
    });
}

    