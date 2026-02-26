import { Component, Input, signal, OnInit, OnDestroy } from '@angular/core';

@Component({
	selector: 'app-navbar',
	standalone: true,
	template: `
		<nav
			class="hero-nav"
			[class.hero-nav-visible]="alwaysVisible"
			[class.hero-nav-solid]="solidBackground"
			[class.hero-nav-static]="!fixed"
			data-nav-bar
		>
			<div class="flex items-center gap-4">
				<a href="/" data-nav-link data-page="home" class="text-sm font-bold tracking-[0.08em] uppercase no-underline text-inherit" data-nav-brand>YNARCHIVE</a>
			</div>
			<div class="flex gap-[3px]">
				<a href="/work" class="text-[13px] tracking-[0.01em] no-underline text-inherit transition-opacity duration-300 hover:opacity-50" [style.opacity]="activePage === 'work' ? 1 : null" data-nav-link data-page="work">Work,</a>
				<a href="/about" class="text-[13px] tracking-[0.01em] no-underline text-inherit transition-opacity duration-300 hover:opacity-50" [style.opacity]="activePage === 'about' ? 1 : null" data-nav-link data-page="about">About</a>
			</div>
			<div class="flex items-center gap-4">
				<span class="text-[13px] tracking-[0.01em] opacity-60">: Tessenderlo, BEL</span>
				<a href="/contact" class="text-[13px] tracking-[0.01em] no-underline text-inherit transition-opacity duration-300 hover:opacity-50" [style.opacity]="activePage === 'contact' ? 1 : null" data-nav-link data-page="contact">Contact</a>
			</div>
		</nav>
	`,
	styles: [
		`
			.hero-nav {
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				z-index: 140;
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 64px;
				padding: 0 clamp(1.5rem, 5vw, 3rem);
				background: transparent;
				color: #0a0a0a;
				opacity: 0;
				pointer-events: none;
				transform: translateY(-10px);
			}
			.hero-nav-visible {
				opacity: 1;
				pointer-events: auto;
				transform: translateY(0);
			}
			.hero-nav-static {
				position: relative;
				top: auto;
				left: auto;
				right: auto;
				width: 100%;
				transform: none;
				opacity: 1;
				pointer-events: auto;
				z-index: 2;
			}
			.hero-nav-solid {
				background: rgba(255, 255, 255, 0.95);
				backdrop-filter: blur(6px);
				border-bottom: 1px solid rgba(10, 10, 10, 0.08);
			}
			.blink-colon {
				animation: blink 1s steps(1, end) infinite;
			}
			@keyframes blink {
				50% { opacity: 0; }
			}
			@media (min-width: 768px) {
				.hero-nav {
					padding: 0 clamp(2rem, 6vw, 5rem);
				}
			}
		`
	]
})
export class NavBarComponent implements OnInit, OnDestroy {
	@Input() fixed = true;
	@Input() alwaysVisible = false;
	@Input() solidBackground = false;
	@Input() activePage: 'home' | 'work' | 'contact' | 'about' | null = null;

	readonly timeHour = signal('00');
	readonly timeMinute = signal('00');
	readonly timePeriod = signal('AM');
	private clockTimer: any;

	ngOnInit(): void {
		this.updateTime();
		this.clockTimer = window.setInterval(() => this.updateTime(), 1000);
	}

	ngOnDestroy(): void {
		window.clearInterval(this.clockTimer);
	}

	private updateTime(): void {
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes();
		const hour12 = hours % 12 || 12;
		this.timeHour.set(String(hour12).padStart(2, '0'));
		this.timeMinute.set(String(minutes).padStart(2, '0'));
		this.timePeriod.set(hours >= 12 ? 'PM' : 'AM');
	}
}
