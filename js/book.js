
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
                // query와 section ID를 매핑
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

                        // 요소 생성 및 추가
                        box.innerHTML = `<img src="${doc.thumbnail}">
                        <h3>${doc.title}</h3>
                        <h6>${doc.authors}</h6>
                        <p>${doc.contents.substring(0,0)}</p>
                        <button>click</button>
                        `
                    });
                }
            } catch (error) {
                console.error('에러 발생:', error);
            }
        }

        async function loadBestBooks() {
            try {
                // 베스트셀러 데이터 15권을 가져옵니다 (3개씩 5기둥)
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
                
                // 15권의 데이터를 3권씩 묶어서 슬라이드(기둥)로 만듭니다
                for(let i = 0; i < data.documents.length; i += 3) {
                    const chunk = data.documents.slice(i, i + 3); // 3권 자르기
                    
                    htmlString += `<div class="swiper-slide list-slide">`;
                    
                    // 자른 3권을 차례대로 가로 리스트 형태로 그립니다
                    chunk.forEach((doc, idx) => {
                        const rank = i + idx + 1; // 1위부터 순위 계산
                        const thumbnail = doc.thumbnail ? doc.thumbnail : "https://placehold.co/70x100/e2e8f0/94a3b8?text=No+Img";
                        
                        // 카카오 API엔 별점이 없으므로 UI 구성을 위해 랜덤 별점을 넣습니다.
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
                
                // 완성된 HTML 덩어리를 화면에 넣습니다
                wrapper.innerHTML = htmlString;
                
                // 💡 데이터가 들어간 직후에 세 번째 스와이퍼를 초기화합니다!
                new Swiper('.mySwiper3', {
                    slidesPerView: 1, // 모바일: 기둥 1개
                    spaceBetween: 20,
                    navigation: { nextEl: '.next3', prevEl: '.prev3' },
                    breakpoints: {
                        768: { slidesPerView: 2, spaceBetween: 20 }, // 태블릿: 기둥 2개
                        1024: { slidesPerView: 3, spaceBetween: 30 } // PC: 기둥 3개 (사진과 동일)
                    }
                });

            } catch (error) {
                console.error('베스트 데이터 에러:', error);
            }
        }
        bookData();
        loadBestBooks();

    