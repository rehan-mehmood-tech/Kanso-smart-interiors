export default function generatingconceptskansoPage() {
  return (
    <>
      
<div className="crossfade-container">
{/* Empty Room */}
<div className="image-layer" id="img-empty" style={{ backgroundImage: "url('https" }}></div>
{/* Designed Room */}
<div className="image-layer" id="img-finished" style={{ backgroundImage: "url('https" }}></div>
{/* Overlay */}
<div className="absolute inset-0 bg-surface/80 backdrop-blur-md flex flex-col justify-center items-center px-lg text-center">
<h1 className="font-display-xl text-display-xl text-primary mb-xl">Kanso</h1>
<h2 className="font-headline-lg text-headline-lg text-primary mb-md">Architecting your vision...</h2>
<p className="font-body-md text-body-md text-secondary status-text h-6 mb-xl" id="status-indicator">
                Analyzing spatial geometry
            </p>
<div className="w-full max-w-md h-[1px] bg-outline-variant rounded-full overflow-hidden">
<div className="progress-bar h-full bg-primary rounded-full" id="progress"></div>
</div>
</div>
</div>
<script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('DOMContentLoaded', () => {
            const finishedImg = document.getElementById('img-finished');
            const emptyImg = document.getElementById('img-empty');
            const progress = document.getElementById('progress');
            const statusText = document.getElementById('status-indicator');
            
            const statuses = [
                'Analyzing spatial geometry',
                'Curating materials',
                'Finalizing lighting',
                'Applying finishes'
            ];
            
            let statusIndex = 0;

            // Start crossfade after a short delay
            setTimeout(() => {
                finishedImg.style.opacity = '0.7';
                emptyImg.style.opacity = '0.3';
                progress.style.width = '100%';
            }, 500);

            // Cycle status text
            setInterval(() => {
                statusIndex = (statusIndex + 1) % statuses.length;
                statusText.textContent = statuses[statusIndex];
            }, 4000);
        });
    ` }} />

    </>
  );
}
