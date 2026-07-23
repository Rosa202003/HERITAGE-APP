const footerHtml = `
      <footer class="main-footer">
        <div class="footer-content" style="max-width: 1200px; margin: 0 auto; padding: 20px 0">
          <!-- Top Row: Brand + Links -->
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 30px; text-align: left; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
            <!-- Brand Column -->
            <div>
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <span style="font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--gold);">Urithi Majengo</span>
              </div>
              <p style="color: var(--text-muted); font-size: 13px; line-height: 1.6; max-width: 280px;">
                A digital heritage inventory managed by the Antiquities Department of Tanzania.
              </p>
              <p style="color: var(--text-muted); font-size: 12px; margin-top: 8px; opacity: 0.6;">
                &copy; 2026 Antiquities Department - United Republic of Tanzania
              </p>
            </div>

            <!-- Explore Column -->
            <div>
              <h4 style="color: rgba(255, 255, 255, 0.4); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">Explore</h4>
              <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 4px;">
                <li><a href="index.html" style="color: var(--text-muted); text-decoration: none; font-size: 13px; transition: color 0.2s;" onmouseover="this.style.color = 'var(--gold)'" onmouseout="this.style.color = ''">Map & Records</a></li>
                <li><a href="buildings.html" style="color: var(--text-muted); text-decoration: none; font-size: 13px; transition: color 0.2s;" onmouseover="this.style.color = 'var(--gold)'" onmouseout="this.style.color = ''">All Buildings</a></li>
                <li><a href="community.html" style="color: var(--text-muted); text-decoration: none; font-size: 13px; transition: color 0.2s;" onmouseover="this.style.color = 'var(--gold)'" onmouseout="this.style.color = ''">Community</a></li>
                <li><a href="risk.html" style="color: var(--text-muted); text-decoration: none; font-size: 13px; transition: color 0.2s;" onmouseover="this.style.color = 'var(--gold)'" onmouseout="this.style.color = ''">Report At-Risk</a></li>
              </ul>
            </div>

            <!-- Partners Column -->
            <div>
              <h4 style="color: rgba(255, 255, 255, 0.4); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">Partners</h4>
              <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 4px;">
                <li style="color: var(--text-muted); font-size: 13px">Antiquities Dept</li>
                <li style="color: var(--text-muted); font-size: 13px">DARCH</li>
                <li style="color: var(--text-muted); font-size: 13px">ARU Architecture Dept</li>
                <li style="color: var(--text-muted); font-size: 13px">Nat'l College Tourism</li>
                <li style="margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.06);">
                  <a href="login.html" style="color: rgba(255, 255, 255, 0.25); text-decoration: none; font-size: 11px; letter-spacing: 0.04em; transition: color 0.2s;" onmouseover="this.style.color = 'rgba(255,255,255,0.5)'" onmouseout="this.style.color = 'rgba(255,255,255,0.25)'">Officer Portal</a>
                </li>
              </ul>
            </div>
          </div>

          <!-- Bottom Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; padding-top: 16px;">
            <p style="color: var(--text-muted); font-size: 12px; opacity: 0.6; margin: 0;">
              &copy; 2026 <span class="gold-text">Urithi Majengo</span>. All rights reserved.
            </p>
            <p style="color: var(--text-muted); font-size: 11px; opacity: 0.4; margin: 0;">
              Built for the Antiquities Department · Tanzania
            </p>
          </div>
        </div>
      </footer>
`;

window.footerHtml = footerHtml;
