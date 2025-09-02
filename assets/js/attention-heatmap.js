/**
 * User Attention Heatmap System
 * Tracks user interactions and generates visual heatmaps
 */

class AttentionHeatmap {
    constructor() {
        this.heatmapData = [];
        this.isTracking = false;
        this.currentSection = null;
        this.sectionStartTime = null;
        this.scrollData = [];
        this.clickData = [];
        this.hoverData = [];
        this.viewportHeight = window.innerHeight;
        this.pageHeight = document.documentElement.scrollHeight;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createHeatmapOverlay();
        this.setupControls();
        this.startTracking();
        this.integrateClarityTracking();
    }

    setupEventListeners() {
        // Scroll tracking
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.trackScroll();
            }, 100);
        });

        // Click tracking
        document.addEventListener('click', (e) => {
            this.trackClick(e);
        });

        // Hover tracking
        document.addEventListener('mousemove', (e) => {
            this.trackHover(e);
        });

        // Section visibility tracking
        this.setupIntersectionObserver();

        // Window resize
        window.addEventListener('resize', () => {
            this.viewportHeight = window.innerHeight;
            this.pageHeight = document.documentElement.scrollHeight;
        });
    }

    setupIntersectionObserver() {
        const sections = document.querySelectorAll('section, .section, .story-section, .philosophy-card, .service-card, .portfolio-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.trackSectionView(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-50px 0px'
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    trackScroll() {
        const scrollY = window.scrollY;
        const scrollPercent = (scrollY / (this.pageHeight - this.viewportHeight)) * 100;
        
        this.scrollData.push({
            timestamp: Date.now(),
            scrollY: scrollY,
            scrollPercent: Math.min(scrollPercent, 100),
            viewportHeight: this.viewportHeight
        });

        this.updateHeatmapVisualization();
    }

    trackClick(event) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY + window.scrollY;
        
        this.clickData.push({
            timestamp: Date.now(),
            x: x,
            y: y,
            element: event.target.tagName,
            className: event.target.className,
            id: event.target.id,
            text: event.target.textContent?.substring(0, 50)
        });

        this.addHeatPoint(x, y, 'click');
    }

    trackHover(event) {
        // Sample hover data (reduce frequency to avoid performance issues)
        if (Math.random() < 0.1) {
            const x = event.clientX;
            const y = event.clientY + window.scrollY;
            
            this.hoverData.push({
                timestamp: Date.now(),
                x: x,
                y: y
            });

            this.addHeatPoint(x, y, 'hover');
        }
    }

    trackSectionView(section) {
        const sectionName = this.getSectionName(section);
        const rect = section.getBoundingClientRect();
        
        if (this.currentSection !== sectionName) {
            if (this.currentSection && this.sectionStartTime) {
                this.recordSectionTime(this.currentSection, Date.now() - this.sectionStartTime);
            }
            
            this.currentSection = sectionName;
            this.sectionStartTime = Date.now();
        }

        // Add section heat
        this.addSectionHeat(section);
    }

    getSectionName(section) {
        // Try to get a meaningful name for the section
        const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) {
            return heading.textContent.trim();
        }
        
        if (section.id) {
            return section.id;
        }
        
        if (section.className.includes('hero')) {
            return 'Hero Section';
        }
        
        if (section.className.includes('philosophy')) {
            return 'Philosophy Section';
        }
        
        if (section.className.includes('project')) {
            return 'Projects Section';
        }
        
        return 'Unknown Section';
    }

    addHeatPoint(x, y, type) {
        this.heatmapData.push({
            x: x,
            y: y,
            type: type,
            timestamp: Date.now(),
            intensity: type === 'click' ? 1.0 : 0.3
        });
    }

    addSectionHeat(section) {
        const rect = section.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + window.scrollY + rect.height / 2;
        
        this.addHeatPoint(centerX, centerY, 'section-view');
    }

    recordSectionTime(sectionName, timeSpent) {
        console.log(`Section "${sectionName}" viewed for ${timeSpent}ms`);
        // Here you could send this data to analytics
    }

    createHeatmapOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'attention-heatmap-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(overlay);
    }

    setupControls() {
        // Create hidden admin toggle
        const adminToggle = document.createElement('button');
        adminToggle.id = 'admin-heatmap-toggle';
        adminToggle.innerHTML = '📊';
        adminToggle.title = 'Admin: Show Heatmap Controls';
        document.body.appendChild(adminToggle);
        
        adminToggle.addEventListener('click', () => {
            const controls = document.getElementById('heatmap-controls');
            controls.style.display = controls.style.display === 'none' ? 'block' : 'none';
        });
        
        const controls = document.createElement('div');
        controls.id = 'heatmap-controls';
        controls.style.display = 'none'; // Hidden by default
        controls.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            background: rgba(255, 255, 255, 0.95);
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            min-width: 200px;
        `;

        controls.innerHTML = `
            <h4 style="margin: 0 0 15px 0; color: #695aa6; font-size: 16px;">Attention Heatmap</h4>
            <button id="toggle-heatmap" style="
                background: #695aa6; 
                color: white; 
                border: none; 
                padding: 8px 16px; 
                border-radius: 5px; 
                cursor: pointer; 
                margin-bottom: 10px;
                width: 100%;
                font-weight: 500;
            ">Show Heatmap</button>
            <button id="clear-heatmap" style="
                background: #dc3545; 
                color: white; 
                border: none; 
                padding: 8px 16px; 
                border-radius: 5px; 
                cursor: pointer; 
                margin-bottom: 10px;
                width: 100%;
                font-weight: 500;
            ">Clear Data</button>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                <div style="margin-bottom: 8px;">
                    <strong>Data Points:</strong> <span id="data-count">0</span>
                </div>
                <div style="margin-bottom: 8px;">
                    <strong>Clicks:</strong> <span id="click-count">0</span>
                </div>
                <div style="margin-bottom: 8px;">
                    <strong>Current Section:</strong> <span id="current-section">-</span>
                </div>
            </div>
        `;

        document.body.appendChild(controls);

        // Event listeners for controls
        document.getElementById('toggle-heatmap').addEventListener('click', () => {
            this.toggleHeatmapDisplay();
        });

        document.getElementById('clear-heatmap').addEventListener('click', () => {
            this.clearHeatmapData();
        });

        // Update stats every 2 seconds
        setInterval(() => {
            this.updateStats();
        }, 2000);
    }

    toggleHeatmapDisplay() {
        const overlay = document.getElementById('attention-heatmap-overlay');
        const button = document.getElementById('toggle-heatmap');
        
        if (overlay.style.opacity === '0' || !overlay.style.opacity) {
            this.renderHeatmap();
            overlay.style.opacity = '0.7';
            button.textContent = 'Hide Heatmap';
            button.style.background = '#dc3545';
        } else {
            overlay.style.opacity = '0';
            button.textContent = 'Show Heatmap';
            button.style.background = '#695aa6';
        }
    }

    renderHeatmap() {
        const overlay = document.getElementById('attention-heatmap-overlay');
        overlay.innerHTML = '';

        // Create canvas for heatmap
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = document.documentElement.scrollHeight;
        canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';
        
        const ctx = canvas.getContext('2d');
        
        // Render heat points
        this.heatmapData.forEach(point => {
            const intensity = point.intensity || 0.5;
            const radius = point.type === 'click' ? 30 : 20;
            
            // Create radial gradient
            const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
            
            if (point.type === 'click') {
                gradient.addColorStop(0, `rgba(255, 0, 0, ${intensity})`);
                gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            } else if (point.type === 'section-view') {
                gradient.addColorStop(0, `rgba(0, 255, 0, ${intensity * 0.5})`);
                gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');
            } else {
                gradient.addColorStop(0, `rgba(255, 255, 0, ${intensity * 0.3})`);
                gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
            }
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
            ctx.fill();
        });

        overlay.appendChild(canvas);
    }

    clearHeatmapData() {
        this.heatmapData = [];
        this.clickData = [];
        this.hoverData = [];
        this.scrollData = [];
        
        const overlay = document.getElementById('attention-heatmap-overlay');
        overlay.innerHTML = '';
        overlay.style.opacity = '0';
        
        const button = document.getElementById('toggle-heatmap');
        button.textContent = 'Show Heatmap';
        button.style.background = '#695aa6';
        
        this.updateStats();
    }

    updateStats() {
        document.getElementById('data-count').textContent = this.heatmapData.length;
        document.getElementById('click-count').textContent = this.clickData.length;
        document.getElementById('current-section').textContent = this.currentSection || '-';
    }

    updateHeatmapVisualization() {
        // Add scroll-based heat points
        if (this.scrollData.length > 0) {
            const lastScroll = this.scrollData[this.scrollData.length - 1];
            const centerX = window.innerWidth / 2;
            const y = lastScroll.scrollY + this.viewportHeight / 2;
            
            this.addHeatPoint(centerX, y, 'scroll');
        }
    }

    startTracking() {
        this.isTracking = true;
        console.log('Attention heatmap tracking started');
    }

    stopTracking() {
        this.isTracking = false;
        console.log('Attention heatmap tracking stopped');
    }

    // Analytics methods
    getMostEngagingSections() {
        const sectionEngagement = {};
        
        this.heatmapData.forEach(point => {
            const element = document.elementFromPoint(point.x, point.y - window.scrollY);
            if (element) {
                const section = element.closest('section, .section, .story-section');
                if (section) {
                    const sectionName = this.getSectionName(section);
                    sectionEngagement[sectionName] = (sectionEngagement[sectionName] || 0) + point.intensity;
                }
            }
        });

        return Object.entries(sectionEngagement)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
    }

    getClickHotspots() {
        return this.clickData
            .reduce((acc, click) => {
                const key = `${Math.floor(click.x / 50)}-${Math.floor(click.y / 50)}`;
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {});
    }

    generateReport() {
        const report = {
            totalDataPoints: this.heatmapData.length,
            totalClicks: this.clickData.length,
            totalScrollEvents: this.scrollData.length,
            mostEngagingSections: this.getMostEngagingSections(),
            clickHotspots: this.getClickHotspots(),
            averageTimeOnPage: this.calculateAverageTimeOnPage(),
            scrollDepth: this.calculateScrollDepth()
        };

        console.log('Attention Heatmap Report:', report);
        return report;
    }

    calculateAverageTimeOnPage() {
        if (this.scrollData.length < 2) return 0;
        const firstEvent = this.scrollData[0].timestamp;
        const lastEvent = this.scrollData[this.scrollData.length - 1].timestamp;
        return (lastEvent - firstEvent) / 1000; // seconds
    }

    calculateScrollDepth() {
        if (this.scrollData.length === 0) return 0;
        const maxScroll = Math.max(...this.scrollData.map(d => d.scrollPercent));
        return Math.round(maxScroll);
    }

    integrateClarityTracking() {
        // Enhanced tracking for Microsoft Clarity integration
        if (typeof clarity !== 'undefined') {
            // Custom events for Clarity
            this.setupClarityEvents();
        }
    }

    setupClarityEvents() {
        // Track section engagement for Clarity
        const sections = document.querySelectorAll('section, .section, .story-section');
        sections.forEach(section => {
            const sectionName = this.getSectionName(section);
            
            // Track when sections come into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && typeof clarity !== 'undefined') {
                        clarity('event', 'section_view', { section: sectionName });
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(section);
        });

        // Track high-engagement clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href*="contact"], .btn-primary, .portfolio-card')) {
                const elementType = e.target.className.includes('btn-primary') ? 'cta_button' : 
                                  e.target.className.includes('portfolio-card') ? 'project_card' : 'contact_link';
                
                if (typeof clarity !== 'undefined') {
                    clarity('event', 'high_engagement_click', { 
                        element: elementType,
                        text: e.target.textContent?.substring(0, 50)
                    });
                }
            }
        });
    }
}

// Initialize heatmap when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.attentionHeatmap = new AttentionHeatmap();
    
    // Generate report every 30 seconds
    setInterval(() => {
        if (window.attentionHeatmap) {
            window.attentionHeatmap.generateReport();
        }
    }, 30000);
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AttentionHeatmap;
}