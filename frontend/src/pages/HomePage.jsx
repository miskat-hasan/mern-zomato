import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food/", { withCredentials: true })
      .then((response) => {
        setVideos(response.data.foodItems || []);
      })
      .catch(() => {
        setVideos([]);
      });
  }, [videos]);

  // Map of id -> HTMLVideoElement
  const videoRefs = useRef(new Map());

  useEffect(() => {
    if (!videos || videos.length === 0) return;

    // Observer to lazy-load videos when they're near the viewport
    const loadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!(video instanceof HTMLVideoElement)) return;

          if (entry.isIntersecting) {
            const src = video.dataset.src;
            const loaded = video.dataset.loaded;
            if (src && !loaded) {
              // assign src and call load to start fetching only when near
              video.src = src;
              // hint the browser to fetch metadata
              try {
                video.load();
              } catch {
                /* ignore */
              }
              video.dataset.loaded = "true";
            }
          }
        });
      },
      { root: null, rootMargin: "500px 0px 500px 0px", threshold: 0.01 }
    );

    // Observer to play/pause the video when it becomes the main visible item
    const playObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!(video instanceof HTMLVideoElement)) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            // pause all other videos
            videoRefs.current.forEach((otherVid) => {
              if (otherVid !== video) otherVid.pause();
            });
            // try to play this one
            video.play().catch(() => {
              // autoplay might be blocked; keep it muted (we already mute)
            });
          } else {
            // pause when not sufficiently visible
            video.pause();
          }
        });
      },
      { threshold: [0, 0.25, 0.6, 0.9, 1] }
    );

    // Observe all current refs
    videoRefs.current.forEach((vid) => {
      if (vid) {
        loadObserver.observe(vid);
        playObserver.observe(vid);
      }
    });

    return () => {
      loadObserver.disconnect();
      playObserver.disconnect();
    };
  }, [videos]);

  // setVideoRef now stores the element by id, and removes it when el is null
  const setVideoRef = (id) => (el) => {
    if (!el) {
      videoRefs.current.delete(id);
      return;
    }
    videoRefs.current.set(id, el);
  };

  return (
    // The container is full viewport height and uses CSS scroll snapping (vertical)
    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      {videos.map((v, index) => {
        const key = v._id || index;
        return (
          <section
            key={key}
            className="snap-start h-screen w-full relative bg-black flex items-center justify-center"
          >
            {/* Video: use object-cover to fill the viewport. Use data-src for lazy loading */}
            <video
              ref={setVideoRef(key)}
              className="absolute inset-0 w-full h-full object-cover"
              data-src={v.video}
              muted
              loop
              playsInline
              preload="none"
            />

            {/* translucent overlay to enhance text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

            {/* Overlay content (positioned at the top-left). Description is clamped to 2 lines */}
            <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-auto">
              <div className="max-w-xl">
                <p className="text-white text-lg font-medium mb-3 line-clamp-2">
                  {v.name}
                </p>
                <Link to={"/food-partner/" + v.foodPartner}>
                  <button
                    className="bg-white/90 text-black px-4 py-2 rounded-full font-semibold shadow-md hover:brightness-95"
                    aria-label={`Visit store for ${v.name}`}
                  >
                    Visit store
                  </button>
                </Link>
              </div>
            </div>

            {/* Optional small indicator (like page index) */}
            <div className="absolute bottom-6 right-6 z-20 text-white/80 text-sm">
              {index + 1} / {videos.length}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default HomePage;
