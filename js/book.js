
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
                        <h6>${doc.authors}</h6>
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

    