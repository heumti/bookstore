
        async function fetchBooks(query) {
            const REST_API_KEY = "d18f434b8312735910e3f93ea885a651";
            const params = new URLSearchParams({
                target: "title",
                query,
                size: 8
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
                    { query: "바이브 코딩", sectionId: "section1" },
                    { query: "정원", sectionId: "sale" }
                ];

                for (const { query, sectionId } of queries) {
                    const data = await fetchBooks(query);

                    // 해당 섹션 내의 .box 요소 8개 선택
                    const section = document.querySelector(`#${sectionId}`);
                    const boxElements = section.querySelectorAll(".swiper-slide");

                    boxElements.forEach((box, i) => {
                        const doc = data.documents[i];
                        if (!doc) return;

                        // 요소 생성 및 추가
                        box.innerHTML = `<img src="${doc.thumbnail}">
                        <h3>${doc.title}</h3>
                        <h6>${doc.authors}</h6>
                        <p>${doc.contents.substring(0, 60)}</p>
                        <button>click</button>
                        `
                    });
                }
            } catch (error) {
                console.error('에러 발생:', error);
            }
        }

        bookData();
