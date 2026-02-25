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
			<div class="nav-left">
				<a href="/" data-nav-link data-page="home" class="nav-brand" data-nav-brand>YNARCHIVE</a>
			</div>
			<div class="nav-center">
				<a href="/work" class="nav-link" [class.nav-link-active]="activePage === 'work'" data-nav-link data-page="work">Work,</a>
				<a href="/" class="nav-link" [class.nav-link-active]="activePage === 'home'" data-nav-link data-page="home">Process,</a>
				<a href="/" class="nav-link" [class.nav-link-active]="activePage === 'home'" data-nav-link data-page="home">Studio</a>
			</div>
			<div class="nav-right">
				<span class="nav-clock">
					<span>{{ timeHour() }}</span><span class="clock-colon">:</span><span>{{ timeMinute() }}</span>
					<span class="clock-period">{{ timePeriod() }}</span>
				</span>
				<a href="/contact" class="nav-link" [class.nav-link-active]="activePage === 'contact'" data-nav-link data-page="contact">Contact</a>
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
				padding: 0 2.5rem;
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
				transform: none;
				opacity: 1;
				pointer-events: auto;
				z-index: 2;
			}
			.hero-nav-solid {
				background: rgba(209, 211, 208, 0.95);
				backdrop-filter: blur(6px);
				border-bottom: 1px solid rgba(10, 10, 10, 0.1);
			}
			.nav-left, .nav-right {
				display: flex;
				align-items: center;
				gap: 1rem;
			}
			.nav-right {
				gap: 1rem;
			}
			.nav-brand {
				font-family: 'area-normal', sans-serif;
				font-size: 14px;
				font-weight: 700;
				letter-spacing: 0.08em;
				text-transform: uppercase;
				color: inherit;
				text-decoration: none;
			}
			.nav-center {
				display: flex;
				gap: 3px;
			}
			.nav-link {
				font-family: 'area-normal', sans-serif;
				font-size: 13px;
				font-weight: 400;
				color: inherit;
				text-decoration: none;
				transition: opacity 0.3s ease;
				letter-spacing: 0.01em;
			}
			.nav-link:hover {
				opacity: 0.5;
			}
			.nav-link-active {
				opacity: 1;
			}
			.nav-clock {
				font-family: 'area-normal', sans-serif;
				font-size: 12px;
				letter-spacing: 0.02em;
				opacity: 0.6;
			}
			.clock-colon {
				animation: blink 1s steps(1, end) infinite;
			}
			.clock-period {
				margin-left: 4px;
				font-size: 10px;
				opacity: 0.5;
				text-transform: uppercase;
			}
			@keyframes blink {
				50% { opacity: 0; }
			}
			@media (max-width: 768px) {
				.hero-nav {
					padding: 0 1.5rem;
				}
			}
		`
	]
})
export class NavBarComponent implements OnInit, OnDestroy {
	@Input() fixed = true;
	@Input() alwaysVisible = false;
	@Input() solidBackground = false;
	@Input() activePage: 'home' | 'work' | 'contact' | null = null;

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
