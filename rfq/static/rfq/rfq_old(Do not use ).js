/*
 * RFQ System Application
 */
window.SystemApps = window.SystemApps || {};
window.__RFQ_BUILD_VERSION__ = 'v66_0'; // SuperTable for Items - high performance with Excel filters

window.SystemApps.rfq = {
    title: 'RFQ System',
    options: {
        width: 1100,
        height: 750
    },
    render: function () {
        return `
            <div class="rfq-layout rfq-standalone">
                <div class="rfq-topbar">
                    <div class="rfq-brand">RFQ System</div>
                    <button id="btn-open-project-picker" class="btn-secondary">Project: <span id="topbar-project-name">Select a Project</span></button>
                    <div class="rfq-topbar-spacer"></div>
                    <div id="topbar-datetime" class="muted" style="margin-right:12px; font-size:12px; white-space:nowrap;"></div>
                    <button id="btn-topbar-upload-quote" class="btn-secondary" type="button" title="Upload quote file for the selected supplier (Bulk Pricing).">⬆ Upload Quoting</button>
                    <button id="btn-topbar-main" class="btn-secondary" type="button">MAIN</button>
<button id="btn-topbar-data" class="btn-secondary" type="button">DATA</button>
<button id="btn-new-project" class="btn-primary">+ New Project</button>
                </div>

                
<div class="rfq-main">
  <div class="project-card">
    <div class="project-card-header">
      <div class="project-card-title" id="current-project-name">Select a Project</div>
    </div>
    <div class="project-tabs" role="tablist" aria-label="Project tabs">
            <button id="nav-main" class="tab" type="button">MAIN</button>
<button id="nav-data" class="tab" type="button">Data</button>
<button id="nav-dashboard" class="tab active" type="button">Dashboard</button>
      <button id="nav-items" class="tab" type="button">Items</button>
      <button id="nav-suppliers" class="tab" type="button">Suppliers</button>
            <button id="nav-project-suppliers" class="tab" type="button">Project Suppliers</button>
<button id="nav-supplier-list" class="tab" type="button">Supplier List</button>
      <button id="nav-quoting" class="tab" type="button">Quoting Process</button>
      <button id="nav-database" class="tab" type="button">Database</button>
          <button id="nav-export" class="tab" type="button">Export</button>
</div>

    <div class="rfq-content project-card-body">

                        

                        <div id="view-main" class="view-section hidden">
    <div style="display:grid; grid-template-columns:280px 1fr; gap:20px; height:100%; padding:20px; overflow:hidden;">
        <!-- LEFT SIDEBAR -->
        <div style="display:flex; flex-direction:column; gap:16px; overflow-y:auto;">
            <!-- Summary Card -->
            <div class="sd-card" style="text-align:center; padding:20px;">
                <div style="font-size:42px; margin-bottom:8px;">📊</div>
                <div style="font-size:18px; font-weight:800;">Global Overview</div>
                <div style="font-size:12px; color:#666; margin-top:4px;">All projects summary</div>
            </div>

            <!-- Main KPIs -->
            <div class="sd-card">
                <div class="sd-card-title">Key Metrics</div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <div class="sd-kpi"><div class="sd-kpi-l">Projects</div><div class="sd-kpi-v" id="main-kpi-projects">0</div></div>
                    <div class="sd-kpi"><div class="sd-kpi-l">Items</div><div class="sd-kpi-v" id="main-kpi-items">0</div></div>
                    <div class="sd-kpi"><div class="sd-kpi-l">Suppliers</div><div class="sd-kpi-v" id="main-kpi-suppliers">0</div></div>
                    <div class="sd-kpi"><div class="sd-kpi-l">RFQ Bundles</div><div class="sd-kpi-v" id="main-kpi-open-bundles">0</div></div>
                    <div class="sd-kpi" style="grid-column:1/-1;"><div class="sd-kpi-l">Total Value</div><div class="sd-kpi-v" id="main-kpi-value" style="color:#28a745;">€0</div></div>
                </div>
            </div>

            <!-- Deadline Alerts -->
            <div class="sd-card">
                <div class="sd-card-title">Deadline Alerts</div>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:#f8d7da; border-radius:8px;">
                        <span style="font-size:12px; font-weight:600; color:#721c24;">Overdue</span>
                        <span id="main-overdue" style="font-size:16px; font-weight:800; color:#721c24;">0</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:#fff3cd; border-radius:8px;">
                        <span style="font-size:12px; font-weight:600; color:#856404;">Due in 7 days</span>
                        <span id="main-due-7" style="font-size:16px; font-weight:800; color:#856404;">0</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:#cce5ff; border-radius:8px;">
                        <span style="font-size:12px; font-weight:600; color:#004085;">Due in 14 days</span>
                        <span id="main-due-soon" style="font-size:16px; font-weight:800; color:#004085;">0</span>
                    </div>
                </div>
            </div>

            <!-- Project Status Breakdown -->
            <div class="sd-card">
                <div class="sd-card-title">Project Status</div>
                <div id="main-status-breakdown" style="display:flex; flex-direction:column; gap:6px;"></div>
            </div>

            <!-- Quick Actions -->
            <div class="sd-card">
                <div class="sd-card-title">Actions</div>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <button id="btn-main-refresh" class="btn-primary" type="button" style="width:100%;">Refresh Data</button>
                    <button id="btn-main-export" class="btn-secondary" type="button" style="width:100%;">Export CSV</button>
                    <button id="btn-main-new-project" class="btn-success" type="button" style="width:100%;">+ New Project</button>
                </div>
            </div>
        </div>

        <!-- MAIN CONTENT -->
        <div style="display:flex; flex-direction:column; gap:16px; overflow:hidden;">
            <!-- Header with filter -->
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                <div style="font-size:18px; font-weight:700;">All Projects</div>
                <div style="display:flex; gap:10px; align-items:center;">
                    <input type="text" id="main-filter" class="macos-input" placeholder="Search projects..." style="width:200px; font-size:12px;">
                    <select id="main-status-filter" class="macos-input" style="font-size:12px;">
                        <option value="">All Status</option>
                        <option value="Created">Created</option>
                        <option value="In process">In Process</option>
                        <option value="Done">Done</option>
                    </select>
                    <span id="main-recent" style="font-size:12px; color:#666;">Last update: —</span>
                </div>
            </div>

            <!-- Projects Table -->
            <div class="sd-card" style="flex:1; display:flex; flex-direction:column; overflow:hidden; padding:0;">
                <div class="table-wrapper" style="flex:1; overflow:auto;">
                    <table class="main-projects-table draggable-table" id="main-projects-table">
                        <thead>
                            <tr>
                                <th data-col-id="project" style="min-width:220px;">Project</th>
                                <th data-col-id="status" style="width:100px;">Status</th>
                                <th data-col-id="items" style="width:70px; text-align:center;">Items</th>
                                <th data-col-id="value" style="width:120px; text-align:right;">Value (EUR)</th>
                                <th data-col-id="suppliers" style="width:80px; text-align:center;">Suppliers</th>
                                <th data-col-id="rfqs" style="width:70px; text-align:center;">RFQs</th>
                                <th data-col-id="quote_pct" style="width:100px;">Quote %</th>
                                <th data-col-id="deadline" style="width:110px;">Deadline</th>
                                <th data-col-id="sent_to" style="width:140px;">Sent To</th>
                                <th data-col-id="actions" style="width:150px; text-align:center;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="main-projects-tbody"></tbody>
                    </table>
                </div>
            </div>

            <!-- Bottom Row: Top Suppliers + Upcoming Deadlines -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                <div class="sd-card" style="padding:0;">
                    <div class="sd-card-title" style="padding:12px 16px; border-bottom:1px solid #e0e0e0; margin:0;">Top Suppliers</div>
                    <div class="table-wrapper" style="max-height:220px; overflow:auto;">
                        <table class="main-suppliers-table">
                            <thead><tr><th>Supplier</th><th style="width:80px; text-align:center;">Bundles</th><th style="width:80px; text-align:center;">Items</th><th style="width:100px; text-align:right;">Value</th></tr></thead>
                            <tbody id="main-top-suppliers-tbody"></tbody>
                        </table>
                    </div>
                </div>
                <div class="sd-card" style="padding:0;">
                    <div class="sd-card-title" style="padding:12px 16px; border-bottom:1px solid #e0e0e0; margin:0;">Upcoming Deadlines</div>
                    <div id="main-upcoming-deadlines" style="max-height:220px; overflow:auto; padding:12px;"></div>
                </div>
            </div>
        </div>
    </div>
    <div id="main-error" class="main-error hidden"></div>
</div>

<div id="view-data-manager" class="view-section hidden">
  <div class="detail-shell">
    <div class="detail-shell-header">
      <div class="detail-shell-title">DATA – Storage & Backup</div>
      <div class="detail-shell-actions">
        <button id="btn-data-refresh" class="btn-secondary" type="button">Refresh</button>
        <button id="btn-data-export-json" class="btn-secondary" type="button">Export Backup (JSON)</button>
        <button id="btn-data-import-json" class="btn-secondary" type="button">Import / Restore</button>
        <button id="btn-data-reset" class="btn-danger" type="button">Reset RFQ Data</button>
      </div>
    </div>
    <div class="detail-shell-body">
      <div id="data-manager-cards" class="data-cards"></div>
      <div class="main-card" style="margin-top:12px;">
        <div class="main-card-title">LocalStorage Keys</div>
        <div class="table-wrapper sd-table-wrap" style="max-height: 340px; overflow:auto;">
          <table id="table-data-keys" class="rfq-table">
            <thead>
              <tr>
                <th style="min-width:260px;">Key</th>
                <th style="width:140px;">Size</th>
                <th>Preview</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      <div class="main-card" style="margin-top:12px;">
        <div class="main-card-title">Help</div>
        <div class="muted" style="font-size:12px; line-height:1.6; padding:8px 2px;">
          Data is saved locally in your browser (LocalStorage) on this device. Use <b>Export Backup</b> to move data to another PC or to create a safety copy. 
          Import/Restore merges by project id (new projects are added, existing ids are updated).
        </div>
      </div>
    </div>
  </div>
  <input type="file" id="file-data-import" accept=".json" style="display:none;">
</div>

<div id="view-project-detail" class="view-section hidden">
  <div style="display:grid; grid-template-columns:300px 1fr; gap:24px; height:100%; padding:20px; overflow:hidden;">
    <!-- LEFT COLUMN -->
    <div style="display:flex; flex-direction:column; gap:16px; overflow-y:auto; padding-right:8px;">
      <!-- Project Card -->
      <div class="sd-card" style="text-align:center; padding:20px;">
        <div style="width:120px; height:90px; background:#f0f0f5; border-radius:12px; margin:0 auto 12px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
          <img id="projdetail-cover-img" src="" alt="" style="max-width:100%; max-height:100%; display:none;">
          <div id="projdetail-cover-empty" style="font-size:42px; color:#999;">📁</div>
        </div>
        <div id="projdetail-title" style="font-size:18px; font-weight:800; margin-bottom:8px;">—</div>
        <div style="display:flex; gap:6px; justify-content:center; flex-wrap:wrap; margin-bottom:8px;">
          <select id="projdetail-status" class="macos-input" style="max-width:180px; font-size:12px;"></select>
          <button class="btn-secondary btn-sm" type="button" data-action="add-project-status" title="Add status">+</button>
        </div>
        <div id="projdetail-id" style="font-size:11px; color:#999; word-break:break-all;">—</div>
      </div>

      <!-- KPIs -->
      <div class="sd-card">
        <div class="sd-card-title">Statistics</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="sd-kpi"><div class="sd-kpi-l">Items</div><div class="sd-kpi-v" id="projdetail-kpi-items">0</div></div>
          <div class="sd-kpi"><div class="sd-kpi-l">Suppliers</div><div class="sd-kpi-v" id="projdetail-kpi-suppliers">0</div></div>
          <div class="sd-kpi" style="grid-column:1/-1;"><div class="sd-kpi-l">Total Value</div><div class="sd-kpi-v" id="projdetail-kpi-value" style="color:#28a745;">€0</div></div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="sd-card">
        <div class="sd-card-title">Quick Actions</div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <button id="btn-projdetail-edit" class="btn-primary" type="button" style="width:100%;">Edit Project</button>
          <button id="btn-projdetail-upload-cover" class="btn-secondary" type="button" style="width:100%;">Set Cover Photo</button>
          <button id="btn-projdetail-back" class="btn-secondary" type="button" style="width:100%;">← Back to Dashboard</button>
        </div>
      </div>

      <!-- Dates Summary -->
      <div class="sd-card">
        <div class="sd-card-title">Key Dates</div>
        <div style="font-size:13px; display:flex; flex-direction:column; gap:6px;">
          <div><b>Received:</b> <span id="projdetail-received">—</span></div>
          <div><b>BOM:</b> <span id="projdetail-bom">—</span></div>
          <div id="projdetail-deadline-row"><b>Deadline:</b> <span id="projdetail-deadline">—</span></div>
          <div><b>Sent:</b> <span id="projdetail-sent">—</span></div>
          <div><b>Sent to:</b> <span id="projdetail-sentto">—</span></div>
        </div>
      </div>
    </div>

    <!-- RIGHT COLUMN with Tabs -->
    <div style="display:flex; flex-direction:column; overflow:hidden;">
      <!-- Tab Header -->
      <div class="sd-tabs" style="flex-shrink:0;">
        <button class="sd-tab active" data-tab="links">Links</button>
        <button class="sd-tab" data-tab="attachments">Attachments</button>
        <button class="sd-tab" data-tab="notes">Notes</button>
        <button class="sd-tab" data-tab="comments">Comments</button>
      </div>

      <!-- Tab Panels -->
      <div class="sd-panels" style="flex:1; overflow-y:auto;">
        <!-- LINKS TAB -->
        <div class="sd-panel active" data-panel="links">
          <div class="sd-card" style="height:100%; display:flex; flex-direction:column;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <div class="sd-card-title" style="margin:0;">Project Links</div>
              <button id="btn-projdetail-add-link" class="btn-primary btn-sm" type="button">+ Add Link</button>
            </div>
            <div class="table-wrapper" style="flex:1; overflow:auto;">
              <table class="items-table" style="font-size:13px;">
                <thead><tr><th>Title</th><th>URL</th><th style="width:60px;"></th></tr></thead>
                <tbody id="projdetail-links-tbody"></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ATTACHMENTS TAB -->
        <div class="sd-panel" data-panel="attachments">
          <div class="sd-card" style="height:100%; display:flex; flex-direction:column;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <div class="sd-card-title" style="margin:0;">Attachments</div>
              <button id="btn-projdetail-upload" class="btn-primary btn-sm" type="button">+ Upload File</button>
            </div>
            <input id="projdetail-file" type="file" style="display:none;">
            <input id="projdetail-cover-file" type="file" accept="image/*" style="display:none;">
            <div id="projdetail-attachments" style="flex:1; overflow:auto;"></div>
          </div>
        </div>

        <!-- NOTES TAB -->
        <div class="sd-panel" data-panel="notes">
          <div class="sd-card" style="height:100%; display:flex; flex-direction:column;">
            <div class="sd-card-title">Project Notes</div>
            <textarea id="projdetail-notes" class="macos-input" style="flex:1; min-height:200px; resize:vertical;" placeholder="Write notes about this project..."></textarea>
            <div style="font-size:11px; color:#999; margin-top:8px;">Auto-saves as you type.</div>
          </div>
        </div>

        <!-- COMMENTS TAB -->
        <div class="sd-panel" data-panel="comments">
          <div class="sd-grid2">
            <div class="sd-card">
              <div class="sd-card-title">Add Comment</div>
              <textarea id="projdetail-comment-text" class="macos-input" rows="4" style="width:100%;" placeholder="Write a comment..."></textarea>
              <button id="btn-projdetail-comment-add" class="btn-primary" type="button" style="margin-top:10px;">Add Comment</button>
            </div>
            <div class="sd-card" style="max-height:400px; overflow-y:auto;">
              <div class="sd-card-title">Comments</div>
              <div id="projdetail-comments"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="view-dashboard" class="view-section">
    <div class="dashboard-content" style="padding: 20px 30px;">

        <!-- Project Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <select id="dash-project-status" class="macos-input" style="min-width: 180px;"></select>
                <button class="btn-secondary btn-sm" type="button" data-action="add-project-status" title="Add custom status">+</button>
                <span id="dash-project-status-pill" class="qt-pill gray">Created</span>
            </div>
            <div id="dashboard-dates-container"></div>
        </div>

        <!-- Project Info Card -->
        <div id="dash-project-info" class="chart-card" style="margin-bottom: 20px; display: grid; grid-template-columns: auto 1fr auto; gap: 20px; align-items: center;">
            <div id="dash-project-cover" style="width:80px; height:80px; border-radius:12px; background:#f0f0f5; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                <img id="dash-project-cover-img" src="" alt="" style="max-width:100%; max-height:100%; display:none;">
                <div id="dash-project-cover-icon" style="font-size:36px; color:#999;">📋</div>
            </div>
            <div>
                <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                    <div id="dash-project-name" style="font-size:20px; font-weight:800; color:#111;">—</div>
                    <span id="dash-project-status-badge" style="padding:4px 10px; border-radius:999px; font-size:11px; font-weight:600; background:#e9ecef; color:#495057;">—</span>
                </div>
                <div style="display:flex; gap:20px; margin-top:8px; font-size:13px; color:#666; flex-wrap:wrap;">
                    <span id="dash-info-created"><b>Created:</b> —</span>
                    <span id="dash-info-received"><b>Received:</b> —</span>
                    <span id="dash-info-bom"><b>BOM:</b> —</span>
                    <span id="dash-info-deadline" style="font-weight:600;"><b>Deadline:</b> —</span>
                </div>
                <div style="display:flex; gap:20px; margin-top:6px; font-size:13px; color:#666; flex-wrap:wrap;">
                    <span id="dash-info-sent"><b>Sent:</b> —</span>
                    <span id="dash-info-sentto"><b>Sent to:</b> —</span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
                <button class="btn-primary btn-sm" data-main-action="open-project-detail" style="white-space:nowrap;">View Details</button>
                <button class="btn-secondary btn-sm" id="btn-dash-edit-project" style="white-space:nowrap;">Edit Project</button>
            </div>
        </div>

        <!-- Key Metrics -->
        <div class="stats-grid" style="grid-template-columns: repeat(5, 1fr);">
            <div class="stat-card">
                <div class="stat-label">Total Items</div>
                <div id="dash-total-items" class="stat-value">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Value</div>
                <div id="dash-total-value" class="stat-value color-blue">€0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Suppliers</div>
                <div id="dash-supplier-count" class="stat-value color-purple">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Quote Rate</div>
                <div id="dash-quote-rate" class="stat-value color-green">0%</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Avg Price</div>
                <div id="dash-avg-price" class="stat-value">€0</div>
            </div>
        </div>

        <!-- Progress Overview -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">

            <!-- Item Progress -->
            <div class="chart-card">
                <h3 style="margin-bottom: 15px;">Item Progress</h3>
                <div id="dash-status-breakdown" class="dash-status-breakdown"></div>
            </div>

            <!-- Quoting Progress -->
            <div class="chart-card">
                <h3 style="margin-bottom: 15px;">Quoting Progress</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div style="text-align: center; padding: 15px; background: rgba(52,199,89,0.1); border-radius: 10px;">
                        <div style="font-size: 24px; font-weight: 700; color: #34C759;" id="dash-quotes-received">0</div>
                        <div style="font-size: 11px; color: #666; margin-top: 4px;">Quotes Received</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: rgba(255,149,0,0.1); border-radius: 10px;">
                        <div style="font-size: 24px; font-weight: 700; color: #FF9500;" id="dash-awaiting-quote">0</div>
                        <div style="font-size: 11px; color: #666; margin-top: 4px;">Awaiting Response</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: rgba(0,122,255,0.1); border-radius: 10px;">
                        <div style="font-size: 24px; font-weight: 700; color: #007AFF;" id="dash-not-sent">0</div>
                        <div style="font-size: 11px; color: #666; margin-top: 4px;">Not Yet Sent</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: rgba(88,86,214,0.1); border-radius: 10px;">
                        <div style="font-size: 24px; font-weight: 700; color: #5856D6;" id="dash-rfq-batches">0</div>
                        <div style="font-size: 11px; color: #666; margin-top: 4px;">RFQ Batches</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts Row -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
            <div class="chart-card">
                <h3>Top Suppliers by Items</h3>
                <div class="chart-container" style="height: 200px;">
                    <canvas id="chart-suppliers"></canvas>
                </div>
            </div>
            <div class="chart-card">
                <h3>Value by Supplier</h3>
                <div class="chart-container" style="height: 200px;">
                    <canvas id="chart-supplier-value"></canvas>
                </div>
            </div>
        </div>

        <!-- Issues Alert -->
        <div id="dashboard-issues-container"></div>

        <!-- Top Items Table -->
        <div class="chart-card" style="margin-top: 20px;">
            <h3>Top 10 Items by Value</h3>
            <div class="table-wrapper" style="max-height: 280px; overflow: auto;">
                <table id="table-top-10" class="rfq-table">
                    <thead>
                        <tr>
                            <th>Part No.</th>
                            <th>Description</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                            <th>Supplier</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>

        <!-- Notes Section -->
        <div class="chart-card" style="margin-top: 20px;">
            <h3>Project Notes</h3>
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <textarea id="dash-notes-text" class="macos-input" rows="2" placeholder="Add a note..." style="flex: 1; resize: none;"></textarea>
                <button id="btn-dash-note-add" class="btn-primary" type="button" style="align-self: flex-end;">Add</button>
            </div>
            <div class="table-wrapper" style="max-height: 200px; overflow: auto;">
                <table class="rfq-table">
                    <thead>
                        <tr>
                            <th style="width: 140px;">Date</th>
                            <th>Note</th>
                            <th style="width: 80px;"></th>
                        </tr>
                    </thead>
                    <tbody id="dash-notes-tbody"></tbody>
                </table>
            </div>
        </div>

    </div>
</div>

                        <div id="view-items" class="view-section hidden" style="display:flex; flex-direction:column; height:100%; overflow:hidden;">
                            <div class="toolbar" style="flex-shrink:0;">
                                <button id="btn-add-item" class="btn-primary">+ Add Item</button>
                                <button id="btn-filter-toggle" class="btn-secondary">Filters</button>
                                <input type="text" id="table-filter" placeholder="Search..." class="search-input">
                                <button id="btn-export-excel" class="btn-success">Export Excel</button>
                                <button id="btn-price-list" class="btn-primary" style="background: #5856d6;">📄 Price List</button>
                                <input type="file" id="file-import-excel" style="display: none;">
                            </div>

                            <div id="filters-panel" class="filters-panel hidden">
                                <select id="filter-status" class="filter-select"><option value="">All Status</option><option>New</option><option>RFQ Sent</option><option>Quote Received</option><option>Pending</option><option>Done</option><option>Expired</option><option>Won</option><option>Lost</option><option>Issue</option><option>Zrušitled</option></select>
                                <select id="filter-supplier" class="filter-select"><option value="">All Suppliers</option></select>
                                <select id="filter-manufacturer" class="filter-select"><option value="">All Manufacturers</option></select>
                                <input type="number" id="filter-price-min" placeholder="Min Price" class="filter-input">
                                <input type="number" id="filter-price-max" placeholder="Max Price" class="filter-input">
                                <button id="btn-clear-filters" class="btn-text">Clear</button>
                            </div>

                            <!-- SuperTable Container for Items -->
                            <div id="items-super-table-container" style="flex:1; overflow:hidden; position:relative;"></div>

                            <!-- Bulk Action Bar (Floating) -->
                            <div id="bulk-action-bar" class="hidden" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: #333; color: white; padding: 12px 24px; border-radius: 50px; display: flex; align-items: center; gap: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 100;">
                                <div style="font-weight: 600; font-size: 13px;"><span id="bulk-count">0</span> Selected</div>
                                <div style="height: 20px; width: 1px; background: rgba(255,255,255,0.2);"></div>
                                <select id="bulk-status-select" class="macos-input" style="background: rgba(255,255,255,0.1); border: none; color: white; width: 150px; padding: 4px 8px;">
                                    <option value="">Change Status</option>
                                    <option value="New">New</option>
                                    <option value="RFQ Sent">RFQ Sent</option>
                                    <option value="Quote Received">Quote Received</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Done">Done</option>
                                    <option value="Expired">Expired</option>
                                    <option value="Won">Won</option>
                                    <option value="Lost">Lost</option>
                                    <option value="Issue">Issue</option>
                                    <option value="Zrušitled">Zrušitled</option>
                                </select>
                                <button id="btn-bulk-export" class="btn-text" style="color: white; font-weight: 500;">📤 Export Selected</button>
                                <button id="btn-bulk-clear" style="background: none; border: none; color: #aaa; font-size: 18px; cursor: pointer; padding: 0 4px;">&times;</button>
                            </div>

                            <div id="empty-state" class="empty-state">
                                <div class="empty-icon">📁</div>
                                <div>Select or create a project to view items</div>
                            </div>

                            <div class="table-footer">
                                <span>Total: <b id="stat-total">0</b></span>
                                <span>Done: <b id="stat-done">0</b></span>
                                <span>Pending: <b id="stat-pending">0</b></span>
                            </div>
                        </div>

                        <!-- Item Detail (Page View) -->
                        <div id="view-item-detail" class="view-section hidden" style="overflow:hidden;">
                            <div class="toolbar">
                                <div style="display:flex; align-items:center; gap:10px;">
                                    <button id="btn-item-detail-back" class="btn-secondary">← Back</button>
                                    <div id="item-detail-page-title" style="font-weight:700; color:#333;">Item Detail</div>
                                </div>
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <button id="btn-item-detail-save" class="btn-success">Uložit</button>
                                    <button id="btn-item-detail-save-back" class="btn-primary">Uložit & Back</button>
                                    <button id="btn-item-detail-delete" class="btn-danger">Delete</button>
                                </div>
                            </div>
                            <div id="item-detail-page-body" style="flex:1; overflow:hidden; padding:12px; background:#f5f5f7;">
                                <div id="item-detail-page-content" style="height:100%;"></div>
                            </div>
                        </div>

                        <div id="view-database" class="view-section hidden">
                            <div class="toolbar">
                                <input type="text" id="database-search" placeholder="Search all parts..." class="search-input">
                                <select id="database-project-filter" class="filter-select" style="width: 150px;"><option value="">All Projects</option></select>
                                <button id="btn-db-clear-filters" class="btn-secondary" type="button">Vymazat filtry</button>
                                <button id="btn-refresh-db" class="btn-secondary">Refresh</button>
                                <button id="btn-db-export-selected" class="btn-success" disabled>📤 Export Selected</button>
                                <button id="btn-db-clear-selection" class="btn-text" disabled>Vymazat výběr</button>
                                <span id="db-selected-count" class="muted" style="margin-left:8px; font-size:12px;">0 selected</span>
                            </div>
                            <div class="table-wrapper sd-table-wrap">
                                <table id="table-database" class="rfq-table">
                                    <thead>
                                        <tr>
                                            <th style="width: 40px;"><input type="checkbox" id="db-select-all"></th>
                                            <th>Item/Drawing No.</th>
                                            <th>Description</th>
                                            <th>Manufacturer</th>
                                            <th>Price Range (EUR)</th>
                                            <th>Used In Projects</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>

                        <div id="view-export" class="view-section hidden">
                            <div class="detail-shell">
                                <div class="detail-shell-header">
                                    <div class="detail-shell-title">📤 Export Center</div>
                                    <div class="detail-shell-actions">
                                        <button id="btn-export-generate" class="btn-primary" type="button">Generate Export</button>
                                    </div>
                                </div>
                                <div class="detail-shell-body">
                                    <div class="export-grid">
                                        <div class="export-card">
                                            <div class="export-card-title">Scope</div>
                                            <div class="form-row">
                                                <label>Projects</label>
                                                <select id="export-scope" class="macos-input">
                                                    <option value="current">Current project</option>
                                                    <option value="selected">Selected projects</option>
                                                    <option value="all">All projects</option>
                                                </select>
                                            </div>
                                            <div class="form-row" id="export-projects-picker-row" style="display:none;">
                                                <label>Select projects</label>
                                                <div id="export-projects-picker" class="export-projects-picker"></div>
                                            </div>
                                        </div>

                                        <div class="export-card">
                                            <div class="export-card-title">Content</div>
                                            <div class="export-checks">
                                                <label class="export-check"><input type="checkbox" id="exp-items" checked> Items</label>
                                                <label class="export-check"><input type="checkbox" id="exp-item-suppliers" checked> Suppliers & Pricing (per item)</label>
                                                <label class="export-check"><input type="checkbox" id="exp-price-breaks" checked> Price breaks</label>
                                                <label class="export-check"><input type="checkbox" id="exp-rfqs" checked> RFQ Bundles</label>
                                                <label class="export-check"><input type="checkbox" id="exp-attachments"> Attachments list (metadata)</label>
                                            </div>
                                            <div class="form-row" style="margin-top:10px;">
                                                <label>Suppliers mode</label>
                                                <select id="export-suppliers-mode" class="macos-input">
                                                    <option value="all">All suppliers per item</option>
                                                    <option value="main">Main supplier only</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="export-card">
                                            <div class="export-card-title">Output</div>
                                            <div class="form-row">
                                                <label>Format</label>
                                                <select id="export-format" class="macos-input">
                                                    <option value="xlsx">Excel (.xlsx)</option>
                                                    <option value="pdf">PDF summary</option>
                                                    <option value="csv">CSV (items only)</option>
                                                </select>
                                            </div>
                                            <div class="muted" style="font-size:12px; margin-top:8px;">
                                                Tip: Excel export creates multiple sheets (Projects, Items, ItemSuppliers, RFQs, Suppliers).
                                            </div>
                                            <div id="export-status" class="muted" style="font-size:12px; margin-top:10px;"></div>
                                        </div>

                                        <div class="export-card">
                                            <div class="export-card-title">Import Templates</div>
                                            <div style="font-size: 12px; color: #666; margin-bottom: 12px;">
                                                Download sample Excel templates for importing data.
                                            </div>
                                            <button id="btn-export-multi-supplier-template" class="btn-secondary" type="button" style="width: 100%; margin-bottom: 8px;">
                                                Download Multi-Supplier Import Template
                                            </button>
                                            <div class="muted" style="font-size: 11px;">
                                                Use this template for bulk importing pricing from multiple suppliers. Includes columns: PartNo, Supplier, Qty_1-10, Price_1-10, Currency, MOQ, MOV, LeadTime, Main.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div id="view-suppliers" class="view-section hidden">
                            <div class="toolbar">
                                <div class="toolbar-left">
                                    <div style="font-weight: 600; color: #333; font-size: 14px;">📦 Bulk Supplier Pricing</div>
                                </div>
                                <div class="toolbar-right">
                                    <label style="font-size: 12px; font-weight: 600;">Select Supplier:</label>
                                    <select id="bulk-supplier-select" class="filter-select" style="width: 220px;">
                                        <option value="">-- Select Supplier --</option>
                                    </select>
                                    <button id="btn-add-new-supplier" class="btn-secondary" style="font-size: 11px;">+ New Supplier</button>
                                    <button id="btn-upload-bulk-quote" class="btn-secondary" style="font-size: 11px;" disabled title="Upload quote file (Excel/CSV/PDF). If Excel/CSV, it can import prices into the table.">⬆ Upload Quoting</button>
                                    <button id="btn-upload-multi-supplier" class="btn-secondary" style="font-size: 11px;" title="Upload pricing for multiple suppliers at once (Excel/CSV)">⬆ Multi-Supplier Upload</button>
                                    <button id="btn-save-bulk-prices" class="btn-primary" disabled>💾 Uložit Bulk Prices</button>
                                </div>
                            </div>
                            <div id="suppliers-content" style="flex: 1; overflow-y: auto; padding: 20px;">
                                <div id="bulk-pricing-empty" style="text-align: center; padding: 60px 20px; color: #999;">
                                    <div style="font-size: 48px; margin-bottom: 16px;">📦</div>
                                    <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">No Supplier Selected</div>
                                    <div style="font-size: 13px;">Select a supplier from the dropdown above to start entering bulk prices</div>
                                </div>
                                <div id="bulk-pricing-table-wrapper" class="hidden">
                                    <div style="margin-bottom: 16px; padding: 12px; background: #f0f9ff; border-radius: 8px; border: 1px solid #007AFF;">
                                        <div style="font-size: 13px; font-weight: 600; color: #007AFF; margin-bottom: 4px;">💡 Bulk Pricing Mode</div>
                                        <div style="font-size: 12px; color: #666;">Enter prices for multiple items at once. Leave fields empty to keep existing values. Click "Uložit Bulk Prices" when done.</div>
                                    </div>
                                    <div class="table-wrapper sd-table-wrap" style="overflow-x: auto;">
                                        <table id="table-bulk-pricing" class="rfq-table">
                                            <thead>
                                                <tr>
                                                    <th style="width: 40px;"><input type="checkbox" id="bulk-select-all"></th>
                                                    <th style="width: 100px;">Part No.</th>
                                                    <th style="width: 250px;">Description</th>
                                                    <th style="width: 100px;">Current Price</th>
                                                    <th style="width: 120px;">New Price</th>
                                                    <th style="width: 100px;">Currency</th>
                                                    <th style="width: 120px;">Price 2 (Optional)</th>
                                                    <th style="width: 100px;">Lead Time</th>
                                                    <th style="width: 100px;">Shipping Cost</th>
                                                    <th style="width: 80px;">Set as Main</th>
                                                </tr>
                                            </thead>
                                            <tbody></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div id="view-project-suppliers" class="view-section hidden">
                            <div class="toolbar">
                                <div style="font-weight: 700; color: #333; font-size: 14px;">🏭 Project Supplier List</div>
                                <input type="text" id="proj-sup-search" placeholder="Search supplier..." class="search-input" style="margin-left: 16px;">
                                <input type="text" id="proj-sup-mfr" placeholder="Filter manufacturer..." class="search-input" style="margin-left: 10px; width: 220px;">
                                <input type="text" id="proj-sup-part" placeholder="Filter part no / MPN..." class="search-input" style="margin-left: 10px; width: 220px;">
                                <div style="margin-left:auto; display:flex; gap:8px; align-items:center;">
                                    <button id="btn-proj-sup-refresh" class="btn-secondary" type="button">Refresh</button>
                                </div>
                            </div>
                            <div class="table-wrapper sd-table-wrap">
                                <table id="table-proj-suppliers" class="rfq-table">
                                    <thead>
                                        <tr>
                                            <th style="min-width:220px;">Supplier</th>
                                            <th style="width:90px;">Items</th>
                                            <th style="width:110px;">Main</th>
                                            <th style="width:130px;">Quoted</th>
                                            <th style="width:130px;">Open RFQs</th>
                                            <th style="width:220px;">Suggestions</th>
                                            <th style="width:120px;">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>

<div id="view-supplier-list" class="view-section hidden">
                            <div class="toolbar">
                                <div style="font-weight: 600; color: #333; font-size: 14px;">🌎 Global Supplier List</div>
                                <input type="text" id="supplier-list-search" placeholder="Search suppliers..." class="search-input" style="margin-left: 20px;">
                                <input type="text" id="supplier-list-mfr" placeholder="Filter manufacturer..." class="search-input" style="margin-left: 10px; width: 220px;">
                                <input type="text" id="supplier-list-part" placeholder="Filter part no / MPN..." class="search-input" style="margin-left: 10px; width: 220px;">
                            </div>
                            <div class="table-wrapper sd-table-wrap">
                                <table id="table-supplier-list" class="rfq-table">
                                    <thead>
                                        <tr>
                                            <th onclick="sortSupplierList('name')" style="cursor: pointer;">Supplier Name ↕</th>
                                            <th onclick="sortSupplierList('status')" style="cursor: pointer;">Status ↕</th>
                                            <th onclick="sortSupplierList('projects')" style="cursor: pointer;">Projects ↕</th>
                                            <th onclick="sortSupplierList('items')" style="cursor: pointer;">Items ↕</th>
                                            <th onclick="sortSupplierList('value')" style="cursor: pointer;">Total Value ↕</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>

                        
                        <!-- Supplier Detail (Page View) -->
                        <div id="view-supplier-detail" class="view-section hidden">
                            <div class="toolbar">
                                <div style="display:flex; align-items:center; gap:10px;">
                                    <button id="btn-supplier-detail-back" class="btn-secondary">← Back</button>
                                    <div id="supplier-detail-page-title" style="font-weight:700; color:#333;">Supplier Detail</div>
                                </div>
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <button id="btn-supplier-detail-save" class="btn-success">Uložit</button>
                                    <button id="btn-supplier-detail-save-back" class="btn-primary">Uložit & Back</button>
                                    <button id="btn-supplier-detail-delete" class="btn-danger">Delete</button>
                                </div>
                            </div>
                            <div id="supplier-detail-page-body" class="rfq-scroll-page" style="padding:12px; background:#f5f5f7;">
                                <div id="supplier-detail-page-content"></div>
                            </div>
                        </div>

<div id="view-bundle-detail" class="view-section hidden">
  <div class="toolbar">
    <div style="display:flex; align-items:center; gap:10px;">
      <button id="btn-bundle-detail-back" class="btn-secondary">← Back</button>
      <div id="bundle-detail-page-title" style="font-weight:700; color:#333;">RFQ Bundle</div>
    </div>
    <div style="display:flex; align-items:center; gap:8px;">
      <button id="btn-bundle-detail-export" class="btn-secondary">Export CSV</button>
      <button id="btn-bundle-detail-delete" class="btn-danger">Delete</button>
      <button id="btn-bundle-detail-save" class="btn-success">Uložit</button>
    </div>
  </div>
  <div id="bundle-detail-page-body" class="rfq-scroll-page" style="padding:12px; background:#f5f5f7;">
    <div id="bundle-detail-page-content"></div>
  </div>
</div>




<div id="view-quote-compare" class="view-section hidden">
  <div class="toolbar">
    <div style="display:flex; align-items:center; gap:10px;">
      <button id="btn-quote-compare-back" class="btn-secondary">← Back</button>
      <div style="font-weight:700; color:#333;">Quote Comparison</div>
    </div>
    <div class="toolbar-right"></div>
  </div>
  <div class="rfq-scroll-page" style="padding:12px; background:#f5f5f7;">
    <div id="quote-compare-page-content"></div>
  </div>
</div>

<div id="view-quoting" class="view-section hidden">
  <div class="toolbar quoting-toolbar">
    <div class="qt-title">📤 Quoting Cockpit</div>
    <div class="qt-hint muted">Supplier → Bundle → Quote → sync to Item Detail</div>
    <div style="margin-left:auto; display:flex; gap:10px; align-items:center;">
      <button id="btn-qt-sync" class="btn-secondary" type="button">Sync</button>
      <button id="btn-qt-compare" class="btn-secondary" type="button">Compare</button>
      <button id="btn-new-rfq-batch" class="btn-primary" type="button">+ New RFQ Bundle</button>
    </div>
  </div>

  <div class="quoting-grid quoting-grid-3">
    <!-- Suppliers Panel -->
    <div class="qt-panel">
      <div class="qt-panel-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="qt-panel-title">Suppliers</div>
          <span id="qt-suppliers-count" class="qt-pill">0</span>
        </div>
        <button id="btn-qt-supplier-detail" class="btn-secondary btn-mini" type="button" disabled>Detail</button>
      </div>
      <div class="qt-panel-toolbar">
        <input id="qt-supplier-filter" type="text" class="search-input" placeholder="Search suppliers…">
      </div>
      <div id="quoting-suppliers-list" class="qt-panel-body">
        <div class="qt-empty">Select a project first</div>
      </div>
    </div>

    <!-- Bundles Panel -->
    <div class="qt-panel">
      <div class="qt-panel-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="qt-panel-title">RFQ Bundles</div>
          <span id="qt-bundles-count" class="qt-pill">0</span>
        </div>
        <select id="qt-bundle-status-filter" class="macos-input qt-compact-select" title="Status filter">
          <option value="">All</option>
          <option value="Draft">Draft</option>
          <option value="Sent">Sent</option>
          <option value="Quote Received">Quote Received</option>
          <option value="Closed">Closed</option>
          <option value="Zrušitled">Zrušitled</option>
        </select>
      </div>
      <div class="qt-panel-toolbar">
        <input id="qt-bundle-filter" type="text" class="search-input" placeholder="Search bundles…">
      </div>
      <div id="quoting-history-list" class="qt-panel-body">
        <div class="qt-empty">No RFQs yet</div>
      </div>
    </div>

    <!-- Workspace Panel -->
    <div id="quoting-wizard-panel" class="qt-panel qt-workspace">
      <div class="qt-workspace-empty">
        <div class="qt-big-icon">🧩</div>
        <div class="qt-workspace-title">Pick a supplier or open an RFQ bundle</div>
        <div class="qt-workspace-sub">Use <b>+ New RFQ Bundle</b> to create a new bundle and start quoting.</div>
      </div>
    </div>
  </div>
</div>

                <div id="sheet-new-project" class="modal-overlay hidden">
                    <div class="modal-content small" style="width: 400px;">
                        <h3>New Project</h3>
                        <div class="form-row" style="margin-bottom: 15px;">
                            <label>Project Name *</label>
                            <input type="text" id="new-project-name" placeholder="E.g. Project Alpha Q1" class="modal-input">
                        </div>
                        <div class="form-row" style="margin-bottom: 15px;">
                            <label>Project Status</label>
                            <div style="display:flex; gap:8px; align-items:center;">
                                <select id="new-project-status" class="modal-input" style="flex:1;"></select>
                                <button class="btn-secondary btn-sm" type="button" data-action="add-project-status" title="Add custom status">+</button>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-row">
                                <label>Received Date</label>
                                <input type="date" id="new-project-received" class="modal-input">
                            </div>
                            <div class="form-row">
                                <label>BOM Received</label>
                                <input type="date" id="new-project-bom" class="modal-input">
                            </div>
                        </div>
                        <div class="form-row" style="margin-bottom: 20px;">
                            <label>Deadline</label>
                            <input type="date" id="new-project-deadline" class="modal-input">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-row">
                                <label>Sent Date</label>
                                <input type="date" id="new-project-sent" class="modal-input">
                            </div>
                            <div class="form-row">
                                <label>Sent To</label>
                                <input type="text" id="new-project-sent-to" placeholder="Client/Supplier" class="modal-input">
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button id="btn-cancel-project" class="btn-secondary">Zrušit</button>
                            <button id="btn-create-project" class="btn-primary">Create Project</button>
                        </div>
                    </div>
                </div>

                <div id="sheet-edit-project" class="modal-overlay hidden">
                    <div class="modal-content small" style="width: 400px;">
                        <h3>Edit Project Details</h3>
                        <div class="form-row" style="margin-bottom: 15px;">
                            <label>Project Name</label>
                            <input type="text" id="edit-project-name" class="modal-input">
                        </div>
                        <div class="form-row" style="margin-bottom: 15px;">
                            <label>Project Status</label>
                            <div style="display:flex; gap:8px; align-items:center;">
                                <select id="edit-project-status" class="modal-input" style="flex:1;"></select>
                                <button class="btn-secondary btn-sm" type="button" data-action="add-project-status" title="Add custom status">+</button>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-row">
                                <label>Received Date</label>
                                <input type="date" id="edit-project-received" class="modal-input">
                            </div>
                            <div class="form-row">
                                <label>BOM Received</label>
                                <input type="date" id="edit-project-bom" class="modal-input">
                            </div>
                        </div>
                        <div class="form-row" style="margin-bottom: 15px;">
                            <label>Deadline</label>
                            <input type="date" id="edit-project-deadline" class="modal-input">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                            <div class="form-row">
                                <label>Sent Date</label>
                                <input type="date" id="edit-project-sent" class="modal-input">
                            </div>
                            <div class="form-row">
                                <label>Sent To</label>
                                <input type="text" id="edit-project-sent-to" class="modal-input">
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button id="btn-cancel-edit-project" class="btn-secondary">Zrušit</button>
                            <button id="btn-save-edit-project" class="btn-primary">Uložit Changes</button>
                        </div>
                    </div>
                </div>

                <div id="sheet-add-choice" class="modal-overlay hidden">
                    <div class="modal-content small text-center">
                        <h3>Add Items</h3>
                        <button id="btn-choice-manual" class="btn-primary full-width mb-10">Manual Entry</button>
                        <button id="btn-choice-import" class="btn-success full-width">Import Excel</button>
                    </div>
                </div>

                <div id="sheet-manual-entry" class="modal-overlay hidden">
                    <div class="modal-content large">
                        <div class="modal-header">New Item</div>
                        <div id="manual-entry-form" class="modal-body form-grid">
                            </div>
                        <div class="modal-footer">
                            <button id="btn-cancel-manual" class="btn-secondary">Zrušit</button>
                            <button id="btn-save-manual" class="btn-primary">Uložit Item</button>
                        </div>
                    </div>
                </div>

                <div id="detail-window" class="detail-overlay hidden"><div class="detail-card">
                    <div class="detail-header">
                        <div class="window-controls">
                            <div class="window-control close" id="btn-close-detail"></div>
                            <div class="window-control minimize" style="opacity: 0.3; pointer-events: none;"></div>
                            <div class="window-control maximize" style="opacity: 0.3; pointer-events: none;"></div>
                        </div>
                        <span class="detail-title">Item Details</span>
                    </div>
                    <div id="detail-content" class="detail-body">
                        </div>
                    <div class="detail-footer">
                        <button id="btn-delete-detail" class="btn-danger">Delete</button>
                        <div class="footer-actions">
                            <button id="btn-cancel-detail-footer" class="btn-secondary">Close</button>
                            <button id="btn-save-detail-no-close" class="btn-success" style="margin-right: 8px;">Uložit</button>
                            <button id="btn-save-detail" class="btn-primary">Uložit & Close</button>
                        </div>
                    </div>
                </div></div>

                <!-- Supplier Detail Window (Overlay) -->
                <div id="supplier-detail-window" class="detail-overlay hidden" style="z-index: 2000;"><div class="detail-card">
                    <div class="detail-header">
                        <div class="window-controls">
                            <div class="window-control close" id="btn-close-supplier-detail"></div>
                            <div class="window-control minimize" style="opacity: 0.3; pointer-events: none;"></div>
                            <div class="window-control maximize" style="opacity: 0.3; pointer-events: none;"></div>
                        </div>
                        <span class="detail-title">Supplier Details</span>
                    </div>
                    <div id="supplier-detail-content" class="detail-body" style="padding: 0; background: #f5f5f7;">
                        <!-- Content generated by JS -->
                    </div>
                    <div class="detail-footer">
                        <button id="btn-export-supplier" class="btn-success">Export Supplier Data</button>
                        <div class="footer-actions">
                            <button id="btn-close-supplier-footer" class="btn-secondary">Close</button>
                        </div>
                    </div>
                </div></div>

                <!-- Price List Modal -->
                <div id="sheet-price-list" class="modal-overlay hidden" style="z-index: 3000;">
                    <div class="modal-content large" style="width: 900px; height: 80vh;">
                        <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center;">
                            <span>Price List Preview</span>
                            <div style="display: flex; gap: 10px;">
                                <button id="btn-print-list" class="btn-primary">🖨️ Print / PDF</button>
                                <button id="btn-close-list" class="btn-secondary">Close</button>
                            </div>
                        </div>
                        <div id="price-list-body" class="modal-body" style="background: white; padding: 40px; overflow-y: auto;">
                            <!-- Content generated by JS -->
                        </div>
                    </div>
                </div>

                <style>
                    /* Scoped Styles for RFQ App */
                    .rfq-layout { display: flex; height: 100%; background: #f5f5f7; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
                    .rfq-sidebar { width: 250px; background: rgba(255,255,255,0.5); backdrop-filter: blur(20px); border-right: 1px solid rgba(0,0,0,0.1); display: flex; flex-direction: column; }
                    .sidebar-header { padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.05); }
                    .sidebar-list { flex: 1; overflow-y: auto; padding: 10px; }
                    .sidebar-item { padding: 8px 12px; border-radius: 6px; cursor: pointer; display: flex; justify-content: space-between; font-size: 13px; color: #333; margin-bottom: 2px; }
                    .sidebar-item:hover { background: rgba(0,0,0,0.05); }
                    .sidebar-item.active { background: rgba(0,122,255,0.15); color: #007AFF; font-weight: 500; }
                    .sidebar-footer { padding: 15px; border-top: 1px solid rgba(0,0,0,0.05); font-size: 11px; color: #999; text-align: center; }
                    
                    .rfq-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: white; }
                    .rfq-nav { height: 50px; border-bottom: 1px solid #eee; display: flex; align-items: center; padding: 0 20px; justify-content: space-between; background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); }
                    .nav-group { display: flex; gap: 25px; }
                    .nav-item { cursor: pointer; font-size: 13px; font-weight: 500; color: #666; padding: 16px 0; position: relative; }
                    .nav-item.active { color: #007AFF; }
                    .nav-item.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: #007AFF; }
                    .current-project-title { font-weight: 600; font-size: 14px; }

                    .rfq-content { flex: 1; overflow: hidden; position: relative; }
                    .view-section { height: 100%; overflow-y: auto; display: flex; flex-direction: column; }
                    .view-section { height: 100%; overflow-y: auto; display: flex; flex-direction: column; }
                    .hidden, .view-section.hidden, .modal-overlay.hidden, .detail-overlay.hidden { display: none !important; }
                    
                    .dashboard-controls { padding: 20px 30px 0; }
                    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; padding: 20px 30px; }
                    .stat-card { background: white; border: 1px solid #eee; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
                    .stat-label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500; }
                    .stat-value { font-size: 28px; font-weight: 700; margin-top: 8px; letter-spacing: -0.5px; }
                    .color-green { color: #34C759; }
                    .color-orange { color: #FF9500; }
                    .color-blue { color: #007AFF; }
                    .color-purple { color: #5856D6; }
                    .color-red { color: #FF3B30; }

                    .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 0 30px 30px; }
                    .chart-card { background: white; border: 1px solid #eee; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
                    .chart-card h3 { font-size: 14px; margin-bottom: 15px; font-weight: 600; }
                    .chart-container { height: 250px; position: relative; }

                    .toolbar { padding: 12px 20px; border-bottom: 1px solid #eee; display: flex; gap: 10px; align-items: center; background: #fafafa; }
                    .filters-panel { padding: 12px 20px; background: #f5f5f7; border-bottom: 1px solid #eee; display: flex; gap: 10px; align-items: center; }
                    .table-wrapper { flex: 1; overflow: auto; width: 100%; }
                    #table-bulk-pricing { min-width: 100%; width: max-content; }
                    .pagination-controls { padding: 10px 20px; background: #fafafa; border-top: 1px solid #eee; display: flex; justify-content: center; align-items: center; gap: 15px; }
                    .page-btn { padding: 4px 12px; background: white; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
                    .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                    .page-info { font-size: 12px; font-weight: 500; color: #555; }
                    .rfq-table { width: 100%; border-collapse: collapse; font-size: 12px; }
                    .rfq-table th { text-align: left; padding: 10px 15px; border-bottom: 1px solid #ddd; background: #f9f9f9; position: sticky; top: 0; font-weight: 600; color: #555; white-space: nowrap; }
                    .rfq-table td { padding: 10px 15px; border-bottom: 1px solid #eee; color: #333; white-space: nowrap; }
                    .rfq-table tr:hover { background: #f0f7ff; cursor: pointer; }
                    .table-footer { padding: 10px 20px; background: #fafafa; border-top: 1px solid #eee; font-size: 11px; display: flex; gap: 20px; color: #666; }

                    .btn-primary { background: #007AFF; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.2s; }
                    .btn-primary:hover { background: #0063CC; }
                    .btn-secondary { background: white; border: 1px solid #ddd; color: #333; padding: 6px 12px; border-radius: 6px; font-size: 13px; cursor: pointer; }
                    .btn-secondary:hover { background: #f5f5f5; }
                    .btn-success { background: #34C759; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 13px; cursor: pointer; }
                    .btn-danger { background: #FF3B30; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 13px; cursor: pointer; }
                    .btn-text { background: none; border: none; color: #007AFF; cursor: pointer; font-size: 12px; }
                    
                    .macos-select, .filter-select, .filter-input, .search-input, .modal-input { padding: 6px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; outline: none; }
                    .search-input { flex: 1; }
                    .full-width { width: 100%; }
                    .mb-10 { margin-bottom: 10px; }
                    .text-center { text-align: center; }

                    .empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #999; }
                    .empty-icon { font-size: 48px; margin-bottom: 10px; opacity: 0.5; }

                    .modal-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); z-index: 100; display: flex; align-items: center; justify-content: center; }
                    .modal-content { background: white; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); overflow: hidden; display: flex; flex-direction: column; }
                    .modal-content.small { width: 320px; padding: 20px; }
                    .modal-content.large { width: 800px; height: 600px; }
                    .modal-header { padding: 15px 20px; border-bottom: 1px solid #eee; font-weight: 600; background: #fafafa; }
                    .modal-body { flex: 1; overflow-y: auto; padding: 20px; }
                    .modal-footer { padding: 15px 20px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 10px; background: #fafafa; }
                    
                    .detail-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #f8f9fa; z-index: 200; display: flex; flex-direction: column; }
                    .detail-header { padding: 15px 30px; border-bottom: 2px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; background: linear-gradient(to bottom, #ffffff, #f5f5f5); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
                    .detail-title { font-weight: 600; font-size: 15px; color: #333; }
                    .control-close { background: #ff5f57; border: none; width: 28px; height: 28px; border-radius: 50%; font-size: 16px; color: white; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }
                    .control-close:hover { transform: scale(1.1); box-shadow: 0 3px 8px rgba(0,0,0,0.25); }
                    .detail-body { flex: 1; overflow-y: auto; padding: 30px 40px; max-width: 1000px; margin: 0 auto; width: 100%; }
                    .detail-footer { padding: 18px 40px; border-top: 2px solid #e0e0e0; display: flex; justify-content: space-between; background: linear-gradient(to top, #ffffff, #f9f9f9); box-shadow: 0 -2px 8px rgba(0,0,0,0.03); }
                    .footer-actions { display: flex; gap: 12px; }

                    .detail-section { margin-bottom: 35px; background: white; border-radius: 12px; padding: 25px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); border: 1px solid #e8e8e8; }
                    .detail-section h3 { font-size: 14px; font-weight: 600; text-transform: uppercase; color: #555; border-bottom: 2px solid #007AFF; padding-bottom: 10px; margin-bottom: 20px; letter-spacing: 0.8px; }
                    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
                    .form-row { display: flex; flex-direction: column; }

                    /* Missing MacOS Styles */
                    .macos-btn { background: white; border: 1px solid #ddd; color: #333; padding: 6px 12px; border-radius: 6px; font-size: 13px; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
                    .macos-btn:hover { background: #f5f5f5; border-color: #ccc; }
                    .macos-input { width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; outline: none; background: white; transition: border-color 0.2s; }
                    .macos-input:focus { border-color: #007AFF; box-shadow: 0 0 0 2px rgba(0,122,255,0.1); }
                    textarea.macos-input { resize: vertical; min-height: 60px; }
                    .form-row label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 8px; color: #333; text-transform: uppercase; letter-spacing: 0.3px; font-size: 11px; }
                    .form-row input, .form-row select { width: 100%; padding: 10px 12px; border: 1.5px solid #ddd; border-radius: 8px; font-size: 13px; transition: all 0.2s; background: white; }

                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #view-dashboard, #view-dashboard * {
                            visibility: visible;
                        }
                        #view-dashboard {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            margin: 0;
                            padding: 20px;
                            background: white;
                            z-index: 9999;
                            overflow: visible !important;
                            display: block !important;
                        }
                        .stat-card {
                            border: 1px solid #ccc;
                            box-shadow: none;
                            break-inside: avoid;
                        }
                        .chart-container {
                            break-inside: avoid;
                            page-break-inside: avoid;
                        }
                        /* Hide buttons inside dashboard when printing */
                        #view-dashboard button, .btn-export-dashboard {
                            display: none !important;
                        }
                    }
                </style>

                    </div>
                </div>

                <div id="project-picker" class="modal-overlay hidden" aria-hidden="true">
                    <div class="modal-card">
                        <div class="modal-header">
                            <div class="modal-title">Select Project</div>
                            <div class="modal-actions">
                                <button id="btn-close-project-picker" class="btn-secondary">Leave</button>
                                <button id="btn-project-picker-ok" class="btn-primary">OK</button>
                            </div>
                        </div>
                        <div class="modal-body">
                            <div id="sidebar-projects" class="sidebar-list project-picker-list"></div>
                        </div>
                        <div class="modal-footer">
                            <div id="menu-time" class="muted"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>
        `;
    },
    init: function (container) {
        const RFQ = window.RFQData || {};
        const FIELDS = Array.isArray(RFQ.FIELDS) ? RFQ.FIELDS : [];
        const CURRENCY_RATES = RFQ.CURRENCY_RATES && typeof RFQ.CURRENCY_RATES === 'object' ? RFQ.CURRENCY_RATES : { EUR: 1 };
        const getProjects = (typeof RFQ.getProjects === 'function') ? RFQ.getProjects : function(){ return []; };
        const createProject = (typeof RFQ.createProject === 'function') ? RFQ.createProject : function(){ alert('RFQData not loaded: createProject'); return null; };
        const updateProject = (typeof RFQ.updateProject === 'function') ? RFQ.updateProject : function(){ return false; };

        // State
        let projects = [];
        let currentProject = null;

        // =========================================================
        // Centralized Status Configuration
        // =========================================================
        const ITEM_STATUSES = ['New', 'RFQ Sent', 'Quote Received', 'Pending', 'Done', 'Won', 'Lost', 'Expired', 'Issue', 'Zrušitled'];
        const RFQ_BATCH_STATUSES = ['Draft', 'Sent', 'Quote Received', 'Closed', 'Zrušitled'];
        const SUPPLIER_QUOTE_STATUSES = ['Pending', 'Active', 'Expired', 'Won', 'Lost', 'No Bid'];

        // Status categories for dashboard calculations
        const DONE_STATUSES = new Set(['Done', 'Won', 'Lost', 'Closed']);
        const IN_PROGRESS_STATUSES = new Set(['RFQ Sent', 'Quote Received', 'Pending']);
        const ISSUE_STATUSES = new Set(['Issue', 'Expired']);

        // Status colors (unified)
        const STATUS_COLORS = {
            'New': '#007AFF',        // Blue - new item
            'RFQ Sent': '#5856D6',   // Purple - sent for quote
            'Quote Received': '#AF52DE', // Magenta - quote received
            'Pending': '#FF9500',    // Orange - waiting
            'Done': '#34C759',       // Green - completed
            'Won': '#30D158',        // Bright green - won
            'Lost': '#8e8e93',       // Gray - lost
            'Expired': '#FF3B30',    // Red - expired
            'Issue': '#FF3B30',      // Red - has issue
            'Zrušitled': '#8e8e93',  // Gray - cancelled
            'Closed': '#34C759',     // Green - closed
            'Draft': '#007AFF',      // Blue - draft
            'Sent': '#5856D6',       // Purple - sent
            'Active': '#34C759',     // Green - active quote
            'No Bid': '#8e8e93',     // Gray - no bid
            'default': '#999'
        };

        function getStatusColorUnified(status) {
            return STATUS_COLORS[status] || STATUS_COLORS['default'];
        }

        // =========================================================
        // Supplier Master DB helpers (deepfix)
        // - prevents crashes in Supplier modal + unifies supplier identity
        // - stored on project.supplierMaster (array)
        // =========================================================
        const _uid = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

        const _normName = (v) => String(v ?? '').trim().toLowerCase();

        function ensureProjectSuppliers(project) {
            if (!project || typeof project !== 'object') return;
            if (!Array.isArray(project.supplierMaster)) project.supplierMaster = [];
            if (!Array.isArray(project.suppliers)) project.suppliers = []; // legacy bucket (optional)
            // RFQ bundles storage aliases (keep both, same array reference)
            if (!Array.isArray(project.rfqBatches) && Array.isArray(project.rfq_batches)) project.rfqBatches = project.rfq_batches;
            if (!Array.isArray(project.rfq_batches) && Array.isArray(project.rfqBatches)) project.rfq_batches = project.rfqBatches;
            if (!Array.isArray(project.rfqBatches)) project.rfqBatches = [];
            project.rfq_batches = project.rfqBatches;
        }

        function getSupplierMasterById(project, id) {
            ensureProjectSuppliers(project);
            if (!id) return null;
            return (project.supplierMaster || []).find(r => String(r.id) === String(id)) || null;
        }

        function getSupplierMasterByName(project, name) {
            ensureProjectSuppliers(project);
            const nn = _normName(name);
            if (!nn) return null;
            return (project.supplierMaster || []).find(r => _normName(r.name) === nn) || null;
        }

        function upsertSupplierMaster(project, rec) {
            ensureProjectSuppliers(project);
            if (!rec || typeof rec !== 'object') return null;
            const r = { ...rec };
            if (!r.id) r.id = _uid();
            if (!r.name) r.name = '';
            if (!r.pipeline) r.pipeline = 'Prospect';
            if (!r.nda) r.nda = { signed: false, signed_date: '', storage: '' };
            if (!Array.isArray(r.custom)) r.custom = [];
            if (typeof r.notes !== 'string') r.notes = '';
            const idx = (project.supplierMaster || []).findIndex(x => String(x.id) === String(r.id));
            if (idx >= 0) project.supplierMaster[idx] = r;
            else project.supplierMaster.push(r);
            return r;
        }

        function getOrCreateSupplierMaster(project, name) {
            ensureProjectSuppliers(project);
            const n = String(name || '').trim();
            if (!n) return null;
            let m = getSupplierMasterByName(project, n);
            if (m) return m;
            m = upsertSupplierMaster(project, {
                id: _uid(),
                name: n,
                pipeline: 'Prospect',
                nda: { signed: false, signed_date: '', storage: '' },
                custom: [],
                notes: '',
                created_at: new Date().toISOString(),
            });
            return m;
        }

        function linkItemSupplierToMaster(itemSup, masterRec) {
            if (!itemSup || typeof itemSup !== 'object' || !masterRec) return;
            itemSup.master_id = masterRec.id;
            if (!itemSup.name && masterRec.name) itemSup.name = masterRec.name;
        }

        // =========================================================
        // Project normalization + RFQ bundle access helpers
        // =========================================================
        function getProjectBatches(project) {
            if (!project) return [];
            // prefer RFQData storage
            if (window.RFQData && typeof window.RFQData.getRFQBatches === 'function' && project.id) {
                const arr = window.RFQData.getRFQBatches(project.id);
                return Array.isArray(arr) ? arr : [];
            }
            // fallback
            if (Array.isArray(project.rfqBatches)) return project.rfqBatches;
            if (Array.isArray(project.rfq_batches)) return project.rfq_batches;
            return [];
        }

        function syncProjectBatchesIntoMemory(project) {
            if (!project) return;
            ensureProjectSuppliers(project);
            const batches = getProjectBatches(project);
            project.rfqBatches = batches;
            project.rfq_batches = batches;
        }

        function ensureItemShape(item) {
            if (!item || typeof item !== 'object') return;
            if (!Array.isArray(item.suppliers)) item.suppliers = [];

            const INCOS = (window.RFQData && Array.isArray(window.RFQData.INCOTERMS))
                ? window.RFQData.INCOTERMS
                : ['EXW','FCA','FAS','FOB','CFR','CIF','CPT','CIP','DPU','DAP','DDP'];
            const isIncoterm = (v) => {
                const s = String(v ?? '').trim().toUpperCase();
                return !!s && INCOS.includes(s);
            };

            // --- Heal common legacy mixups (shipping_cost accidentally holds Incoterms etc.) ---
            if (isIncoterm(item.shipping_cost) && !String(item.incoterms || '').trim()) {
                item.incoterms = String(item.shipping_cost || '').trim().toUpperCase();
                item.shipping_cost = '';
            }

            // normalize supplier records (aliases + repairs)
            item.suppliers.forEach(s => {
                if (!s || typeof s !== 'object') return;

                // shipping aliasing
                if (s.shipping === undefined && s.shipping_cost !== undefined) s.shipping = s.shipping_cost;
                if (s.shipping_cost === undefined && s.shipping !== undefined) s.shipping_cost = s.shipping;

                // accidental incoterms stored in shipping
                if (isIncoterm(s.shipping) && !String(s.incoterms || '').trim()) {
                    s.incoterms = String(s.shipping || '').trim().toUpperCase();
                    s.shipping = '';
                    s.shipping_cost = '';
                }

                // prefer numeric-like string for shipping fields (do not crash number inputs)
                const shipStr = String(s.shipping ?? '').trim();
                if (shipStr && !/^[0-9]+([.,][0-9]+)?$/.test(shipStr) && !isIncoterm(shipStr)) {
                    // keep as-is, but avoid mirroring into item-level numeric field later
                }

                // legacy price aliases
                if (s.price_1 === undefined && s.price !== undefined) s.price_1 = s.price;
                if (s.price === undefined && s.price_1 !== undefined) s.price = s.price_1;
                if (!Array.isArray(s.prices)) s.prices = [];
            });

            // legacy main supplier -> ensure exists as record (optional, only if there is a name)
            const mainName = String(item.supplier || '').trim();
            if (mainName && !item.suppliers.some(s => _normName(s.name) === _normName(mainName))) {
                item.suppliers.push({
                    id: _uid(),
                    name: mainName,
                    currency: item.currency || 'EUR',
                    isMain: true,
                    status: item.status || 'New',
                    prices: [],
                    price: item.price_1 || '',
                    price_1: item.price_1 || '',
                    price_2: item.price_2 || '',
                    incoterms: item.incoterms || '',
                    moq: item.moq || '',
                    mov: item.mov || '',
                    lead_time: item.lead_time || '',
                    shipping: item.shipping_cost || '',
                    shipping_cost: item.shipping_cost || '',
                    quote_valid_until: item.quote_valid_until || '',
                    quote_status: item.quote_status || '',
                });
            }

            // ensure at least one main supplier if suppliers exist and none marked main
            if (item.suppliers.length) {
                const anyMain = item.suppliers.some(s => !!s.isMain);
                if (!anyMain) item.suppliers[0].isMain = true;
            }
        }




// =========================================================
// Quantity tier helpers (dynamic qty_1..qty_N)
// - keeps Item Quantities, Suppliers & Pricing, and RFQ Bundles in sync
// =========================================================
function getItemQtyKeys(item) {
    if (!item || typeof item !== 'object') return [];
    return Object.keys(item)
        .filter(k => /^qty_\d+$/.test(k))
        .sort((a, b) => Number(a.split('_')[1]) - Number(b.split('_')[1]));
}

function getMaxQtyIndex(item, minDefault = 5) {
    const keys = getItemQtyKeys(item);
    let max = minDefault;
    keys.forEach(k => {
        const n = Number(k.split('_')[1]);
        if (Number.isFinite(n) && n > max) max = n;
    });
    return max;
}

function getItemQtyTiers(item, { includeBlanks = false, minDefault = 5 } = {}) {
    if (!item || typeof item !== 'object') return [];
    const max = getMaxQtyIndex(item, minDefault);
    const out = [];
    for (let i = 1; i <= max; i++) {
        const key = `qty_${i}`;
        const raw = item[key];
        const hasVal = String(raw ?? '').trim() !== '' && !Number.isNaN(Number(raw));
        if (!includeBlanks && !hasVal) continue;
        out.push({ index: i, key, value: raw });
    }
    // filter out non-positive if not blanks
    return out.filter(t => includeBlanks ? true : (String(t.value ?? '').trim() !== '' && Number(t.value) > 0));
}

function getSupplierPriceByIndex(sup, idx) {
    if (!sup) return '';
    if (idx === 1) return (sup.price_1 ?? sup.price ?? '');
    const k = `price_${idx}`;
    return (sup[k] ?? '');
}

function setSupplierPriceByIndex(sup, idx, val) {
    if (!sup) return;
    const v = String(val ?? '').trim();
    if (idx === 1) { sup.price = v; sup.price_1 = v; return; }
    sup[`price_${idx}`] = v;
}

// Ensure supplier.prices array mirrors current qty tiers (by index)
function syncSupplierPricingToQtyTiers(item) {
    if (!item || typeof item !== 'object') return;
    ensureItemShape(item);
    const tiers = getItemQtyTiers(item, { includeBlanks: true });
    (item.suppliers || []).forEach(sup => {
        if (!sup || typeof sup !== 'object') return;
        if (!Array.isArray(sup.prices)) sup.prices = [];
        const newPrices = [];
        tiers.forEach(t => {
            const qRaw = t.value;
            const q = (String(qRaw ?? '').trim() !== '' && !Number.isNaN(Number(qRaw))) ? Number(qRaw) : null;

            // pick price: first try matching old prices by qty, else by index
            let p = '';
            if (q !== null) {
                const found = (sup.prices || []).find(r => Number(r.qty) === Number(q));
                if (found && String(found.price ?? '').trim() !== '') p = String(found.price).trim();
            }
            if (p === '') p = String(getSupplierPriceByIndex(sup, t.index) ?? '').trim();

            if (q !== null) newPrices.push({ qty: q, price: p });
            setSupplierPriceByIndex(sup, t.index, p);
        });
        sup.prices = newPrices.filter(r => String(r.price ?? '').trim() !== '');
        sup.prices.sort((a,b) => Number(a.qty) - Number(b.qty));
        // keep legacy mirrors for first 5 tiers
        sup.price = getSupplierPriceByIndex(sup, 1);
        sup.price_1 = getSupplierPriceByIndex(sup, 1);
        sup.price_2 = getSupplierPriceByIndex(sup, 2);
        sup.price_3 = getSupplierPriceByIndex(sup, 3);
        sup.price_4 = getSupplierPriceByIndex(sup, 4);
        sup.price_5 = getSupplierPriceByIndex(sup, 5);
    });
}

// Update bundle lines to reflect latest item quantities (prices kept by tier index)
function syncBundlesQtyFromItem(project, item) {
    if (!project || !item) return;
    const dn = String(item.item_drawing_no || '').trim();
    if (!dn) return;
    const batches = getProjectBatches(project);
    const max = getMaxQtyIndex(item, 5);
    let touched = false;
    (batches || []).forEach(b => {
        if (!b || !Array.isArray(b.items)) return;
        b.items.forEach(line => {
            if (!line) return;
            if (String(line.drawing_no || '').trim() !== dn) return;
            // ensure line has price slots for current tiers (keep values)
            for (let i = 1; i <= max; i++) {
                const k = `price_${i}`;
                if (i === 1) {
                    if (line.price === undefined && line.price_1 !== undefined) line.price = line.price_1;
                    if (line.price_1 === undefined && line.price !== undefined) line.price_1 = line.price;
                } else {
                    if (line[k] === undefined) line[k] = '';
                }
            }
            touched = true;
        });
    });
    if (touched && window.RFQData && typeof window.RFQData.saveRFQBatch === 'function' && project.id) {
        // Uložit all touched batches back (best-effort)
        (batches || []).forEach(b => window.RFQData.saveRFQBatch(project.id, b));
    }
}

        function upsertSupplierOnItem(item, supplierName) {
            ensureItemShape(item);
            const name = String(supplierName || '').trim();
            if (!name) return null;
            let sup = item.suppliers.find(s => s && _normName(s.name) === _normName(name));
            if (!sup) {
                const mRec = (currentProject ? getOrCreateSupplierMaster(currentProject, name) : null);
                const defCur = (mRec && mRec.defaults && mRec.defaults.currency) ? mRec.defaults.currency : 'EUR';
                const defInc = (mRec && mRec.defaults && mRec.defaults.incoterms) ? mRec.defaults.incoterms : '';
                const defPay = (mRec && mRec.defaults && mRec.defaults.payment_terms) ? mRec.defaults.payment_terms : '';
                const defLead = (mRec && mRec.defaults && mRec.defaults.lead_time) ? mRec.defaults.lead_time : '';
                const defShip = (mRec && mRec.defaults && mRec.defaults.shipping_cost) ? mRec.defaults.shipping_cost : '';
                sup = { id: _uid(), name, currency: defCur, incoterms: defInc, payment_terms: defPay, lead_time: defLead, shipping_cost: defShip, shipping: defShip, isMain: item.suppliers.length === 0, status: 'Planned', prices: [] };
                if (mRec) linkItemSupplierToMaster(sup, mRec);
                item.suppliers.push(sup);
            }
            return sup;
        }

        function upsertPriceTier(sup, qty, price) {
            if (!sup) return;
            if (!Array.isArray(sup.prices)) sup.prices = [];
            const q = qty !== undefined && qty !== null && String(qty).trim() !== '' ? Number(qty) : null;
            const p = String(price ?? '').trim();
            if (!p) return;
            if (q === null || Number.isNaN(q)) {
                // fallback: store as legacy price_1
                sup.price = p;
                sup.price_1 = p;
                return;
            }
            const idx = sup.prices.findIndex(r => Number(r.qty) === Number(q));
            if (idx >= 0) sup.prices[idx] = { qty: q, price: p };
            else sup.prices.push({ qty: q, price: p });
            sup.prices.sort((a,b) => Number(a.qty) - Number(b.qty));

            // keep legacy mirrors (up to 5 tiers)
            sup.price = sup.prices[0]?.price || sup.price || '';
            sup.price_1 = sup.prices[0]?.price || sup.price_1 || '';
            sup.price_2 = sup.prices[1]?.price || sup.price_2 || '';
            sup.price_3 = sup.prices[2]?.price || sup.price_3 || '';
            sup.price_4 = sup.prices[3]?.price || sup.price_4 || '';
            sup.price_5 = sup.prices[4]?.price || sup.price_5 || '';
        }

        function applyBatchToItems(project, batch, mode) {
            if (!project || !batch) return;
            const supName = String(batch.supplier_name || batch.supplier || '').trim();
            if (!supName) return;
            const itemsByDn = new Map((project.items || []).map(it => [String(it.item_drawing_no || '').trim(), it]));
            (batch.items || []).forEach(line => {
                const dn = String(line.drawing_no || line.item_drawing_no || line.item_no || line.part_no || line.dn || '').trim();
                if (!dn) return;
                const it = itemsByDn.get(dn);
                if (!it) return;
                ensureItemShape(it);

                const sup = upsertSupplierOnItem(it, supName);
                // link to master
                const m = getOrCreateSupplierMaster(project, supName);
                if (m) linkItemSupplierToMaster(sup, m);

                // status propagation
                const lineStatus = String(line.quote_status || '').trim();
                if (mode === 'sent' || String(batch.status || '') === 'Sent') {
                    sup.status = 'RFQ Sent';
                    if (String(it.status || '') === 'New') it.status = 'RFQ Sent';
                }
                if (mode === 'received' || String(batch.status || '') === 'Quote Received') {
                    sup.status = (String(lineStatus || '').toLowerCase() === 'no bid') ? 'No Bid' : 'Quote Received';
                    // update item high-level status unless Done
                    if (!['Done','Closed'].includes(String(it.status || ''))) it.status = 'Quote Received';
                }

                // quote fields
                sup.currency = line.currency || batch.currency || sup.currency || 'EUR';
                sup.incoterms = batch.incoterms || sup.incoterms || '';
                if (line.valid_until) sup.quote_valid_until = line.valid_until;
                if (line.moq !== undefined) sup.moq = line.moq;
                if (line.mov !== undefined) sup.mov = line.mov;
                if (line.shipping_cost !== undefined) sup.shipping = line.shipping_cost;
                if (line.payment_terms !== undefined) sup.payment_terms = line.payment_terms;
                if (line.packaging !== undefined) sup.packaging = line.packaging;
                if (line.note !== undefined) sup.notes = line.note;
                if (line.lead_time_days !== undefined) sup.lead_time_days = line.lead_time_days;
                if (line.lead_time_days !== undefined && !sup.lead_time) sup.lead_time = String(line.lead_time_days || '').trim();
                if (lineStatus) sup.quote_status = lineStatus;

                // pricing (dynamic qty tiers)
let hasAnyQuotedPrice = false;
const tiers = getItemQtyTiers(it, { includeBlanks: false });
if (String(lineStatus || '').toLowerCase() !== 'no bid') {
    if (tiers.length === 0) {
        const p = String((line.price_1 ?? line.price ?? '') ?? '').trim();
        if (p !== '') {
            hasAnyQuotedPrice = true;
            upsertPriceTier(sup, null, p);
        }
    } else {
        tiers.forEach(t => {
            const k = `price_${t.index}`;
            const pRaw = (t.index === 1)
                ? (line.price_1 ?? line.price ?? '')
                : (line[k] ?? '');
            const p = String(pRaw ?? '').trim();
            if (String(t.value ?? '').trim() !== '' && p !== '') {
                hasAnyQuotedPrice = true;
                upsertPriceTier(sup, t.value, p);
            }
        });
    }
}

// Auto-promote supplier status from Quoting:
// If line Quote status = Quoted and user entered any price, treat it as Quote Received
// on the item supplier (no need to press "Mark Quote Received" on the bundle).
if (String(lineStatus || '').toLowerCase() === 'quoted' && hasAnyQuotedPrice) {
    sup.status = 'Quote Received';
    if (!['Done','Closed'].includes(String(it.status || ''))) it.status = 'Quote Received';
}

// if supplier is main, mirror to item main fields
                if (sup.isMain) {
                    it.supplier = sup.name;
                    it.currency = sup.currency || it.currency;
                    it.incoterms = sup.incoterms || it.incoterms;
                    it.price_1 = sup.price_1 || sup.price || it.price_1;
                    it.price_2 = sup.price_2 || it.price_2;
                    it.moq = sup.moq || it.moq;
                    it.mov = sup.mov || it.mov;
                    it.lead_time = sup.lead_time || it.lead_time;
                    it.shipping_cost = sup.shipping || it.shipping_cost;
                    it.quote_valid_until = sup.quote_valid_until || it.quote_valid_until;
                    if (typeof calculateEuroValues === 'function') calculateEuroValues(it);
                }
            });
        }

        function syncAllBatchesToItems(project) {
            if (!project) return;
            const batches = getProjectBatches(project);
            batches.forEach(b => {
                // apply best-effort mapping without forcing statuses unless bundle is sent/received
                const st = String(b.status || '').trim();
                const mode = (st === 'Sent') ? 'sent' : (st === 'Quote Received' ? 'received' : 'save');
                applyBatchToItems(project, b, mode);
            });
        }

        // Project Picker (deferred selection)
        let projectPickerIsOpen = false;
        let projectPickerPendingId = null;

        function setProjectNameUI(name){
            const label = name && String(name).trim() ? String(name).trim() : 'Select a Project';
            if (currentProjectName) currentProjectName.textContent = label;
            if (topbarProjectName) topbarProjectName.textContent = label;
        }

        let filterText = '';
        let currentDetailIndex = null;
        let activeFilters = { status: '', supplier: '', manufacturer: '', priceMin: '', priceMax: '' };
        let currentView = 'dashboard';
        let supplierDetailReturnView = 'suppliers';
        let supplierDetailCurrentName = '';
        let itemDetailReturnView = 'items';

        let selectedItems = new Set(); // Track selected item indices

        let selectedDbParts = new Set(); // Track selected database MPN keys
        let __dbIndex = {}; // { key: {mpn, description, manufacturer, ... , refs: [{projectId, projectName, drawingNo}] } }


        // Bulk Pricing State
        let bulkCurrentPage = 1;
        const bulkItemsPerPage = 50;
        let bulkPricingFilterText = '';
        let bulkPricingFilterPart = '';
        let bulkPricingFilterMfr = '';
        let bulkPricingFilterDesc = '';

        // Charts
        let suppliersChart = null;
        let supplierValueChart = null;

        const getEl = (id) => {
        if (container) {
            return container.querySelector('#' + id) || document.getElementById(id);
        }
        return document.getElementById(id);
    };

        // DOM Elements
        const navMain = getEl('nav-main');
        const navData = getEl('nav-data');
        const navDashboard = getEl('nav-dashboard');
        const navItems = getEl('nav-items');
        const navSuppliers = getEl('nav-suppliers');
        const navProjectSuppliers = getEl('nav-project-suppliers');
        const navSupplierList = getEl('nav-supplier-list');
        const navDatabase = getEl('nav-database');
        const navExport = getEl('nav-export');
        const viewMain = getEl('view-main');
        const viewDataManager = getEl('view-data-manager');
        const viewDashboard = getEl('view-dashboard');
        const viewProjectDetail = getEl('view-project-detail');
        const viewItems = getEl('view-items');
        const viewItemDetail = getEl('view-item-detail');
        const viewSuppliers = getEl('view-suppliers');
        const viewProjectSuppliers = getEl('view-project-suppliers');
        const viewSupplierList = getEl('view-supplier-list');

                const viewSupplierDetail = getEl('view-supplier-detail');
        const viewBundleDetail = getEl('view-bundle-detail');
        const viewQuoteCompare = getEl('view-quote-compare');
const viewQuoting = getEl('view-quoting');
        const viewDatabase = getEl('view-database');
        const viewExport = getEl('view-export');

        const btnSupplierDetailBack = getEl('btn-supplier-detail-back');
        const btnSupplierDetailUložit = getEl('btn-supplier-detail-save');
        const btnSupplierDetailUložitBack = getEl('btn-supplier-detail-save-back');
        const btnSupplierDetailDelete = getEl('btn-supplier-detail-delete');

        const btnBundleDetailBack = getEl('btn-bundle-detail-back');
        const btnBundleDetailSave = getEl('btn-bundle-detail-save');
        const btnBundleDetailDelete = getEl('btn-bundle-detail-delete');
        const btnBundleDetailExport = getEl('btn-bundle-detail-export');
        const bundleDetailPageTitle = getEl('bundle-detail-page-title');
        const bundleDetailPageContent = getEl('bundle-detail-page-content');

        const btnItemDetailBack = getEl('btn-item-detail-back');
        const btnItemDetailUložit = getEl('btn-item-detail-save');
        const btnItemDetailUložitBack = getEl('btn-item-detail-save-back');
        const btnItemDetailDelete = getEl('btn-item-detail-delete');



        // Navigation Elements
        const navQuoting = getEl('nav-quoting');

        // Additional DOM Elements for functions
        const sidebarProjects = getEl('sidebar-projects');
        const currentProjectName = getEl('current-project-name');
        const topbarProjectName = getEl('topbar-project-name');
        const btnTopbarMain = getEl('btn-topbar-main');
        const btnTopbarData = getEl('btn-topbar-data');
        const btnTopbarUploadQuote = getEl('btn-topbar-upload-quote');
        // const dashboardProjectSelect = getEl('dashboard-project-select'); // Removed
        const sheetNewProject = getEl('sheet-new-project');
        const inputNewProjectName = getEl('new-project-name');

        const sheetManualEntry = getEl('sheet-manual-entry');
        const manualEntryForm = getEl('manual-entry-form');

        const emptyState = container ? container.querySelector('.empty-state') : null;
        const dataTableBody = viewItems ? viewItems.querySelector('tbody') : null;
        const tableDatabaseBody = viewDatabase ? viewDatabase.querySelector('tbody') : null;

        // Overlay Elements
        const detailWindow = getEl('detail-window');
        const detailContent = getEl('detail-content');
        const supplierDetailWindow = getEl('supplier-detail-window');
        const supplierDetailContent = getEl('supplier-detail-content');
        const sheetPriceList = getEl('sheet-price-list');
        const fileImportExcel = getEl('file-import-excel');

        // Filter Elements
        const tableFilter = getEl('table-filter');
        const filterStatus = getEl('filter-status');
        const filterSupplier = getEl('filter-supplier');
        const filterManufacturer = getEl('filter-manufacturer');
        const filterPriceMin = getEl('filter-price-min');
        const filterPriceMax = getEl('filter-price-max');

        // Stats
        const statTotal = getEl('stat-total');
        const statDone = getEl('stat-done');
        const statPending = getEl('stat-pending');

        // Database Elements
        const databaseSearch = getEl('database-search');
        const databaseProjectFilter = getEl('database-project-filter');

        // =========================================================
// Project status (per project)
// - 3 defaults + custom statuses (stored in LocalStorage)
// =========================================================

function normStatusValue(v) {
    const s = String(v || '').trim();
    return s ? s : 'Created';
}

function getStatusOptions() {
    try {
        if (window.RFQData && typeof window.RFQData.getProjectStatusOptions === 'function') {
            return window.RFQData.getProjectStatusOptions();
        }
    } catch (e) {}
    return ['Created', 'In process', 'Done'];
}

function fillProjectStatusSelect(selectEl, currentValue) {
    if (!selectEl) return;
    const cur = normStatusValue(currentValue);
    const opts = getStatusOptions();
    selectEl.innerHTML = opts.map(s => {
        const sel = String(s).toLowerCase() === String(cur).toLowerCase() ? 'selected' : '';
        return `<option value="${escapeHtml(String(s))}" ${sel}>${escapeHtml(String(s))}</option>`;
    }).join('');
    // if current is custom and missing (edge case), add it
    if (cur && !opts.some(s => String(s).toLowerCase() === String(cur).toLowerCase())) {
        const opt = document.createElement('option');
        opt.value = cur;
        opt.textContent = cur;
        opt.selected = true;
        selectEl.appendChild(opt);
    }
    selectEl.value = cur;
}

function getCurrentProjectStatus() {
    if (!currentProject) return 'Created';
    return normStatusValue(currentProject.project_status || currentProject.status);
}

function setCurrentProjectStatus(newStatus) {
    if (!currentProject) return;
    currentProject.project_status = normStatusValue(newStatus);
    if (typeof updateProject === 'function') updateProject(currentProject);
    try { renderSidebar(); } catch (e) {}
    try { renderDashboardProjectStatus(); } catch (e) {}
    try { renderProjectDetail(); } catch (e) {}
}

function openAddProjectStatusModal(onAdded) {
    const id = 'project-status-editor-modal';
    let overlay = document.getElementById(id);
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = id;
        overlay.className = 'modal-overlay';
        overlay.style.zIndex = '3600';
        overlay.innerHTML = `
            <div class="modal-content small" style="width: 420px;">
                <h3 style="margin-top:0;">Add Project Status</h3>
                <div class="form-row" style="margin-bottom: 12px;">
                    <label>Status name</label>
                    <input type="text" id="proj-status-new-name" class="modal-input" placeholder="e.g. Waiting for customer">
                </div>
                <div class="muted" style="font-size:12px; margin-top:-4px; margin-bottom: 12px;">
                    This status will be available in all projects on this PC (LocalStorage).
                </div>
                <div class="modal-actions">
                    <button id="btn-proj-status-cancel" class="btn-secondary" type="button">Cancel</button>
                    <button id="btn-proj-status-add" class="btn-primary" type="button">Add</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    const close = () => { overlay.classList.add('hidden'); overlay.setAttribute('aria-hidden','true'); };
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden','false');

    const input = document.getElementById('proj-status-new-name');
    const btnCancel = document.getElementById('btn-proj-status-cancel');
    const btnAdd = document.getElementById('btn-proj-status-add');

    if (input) {
        input.value = '';
        try { input.focus(); } catch (e) {}
    }

    if (btnCancel) btnCancel.onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };

    if (btnAdd) btnAdd.onclick = () => {
        const name = input ? String(input.value || '').trim() : '';
        if (!name) { alert('Enter a status name'); return; }
        try {
            if (window.RFQData && typeof window.RFQData.addProjectStatusOption === 'function') {
                window.RFQData.addProjectStatusOption(name);
            } else {
                // fallback
                const key = 'rfq_project_status_options_v1';
                const arr = (() => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } })();
                arr.push(name);
                localStorage.setItem(key, JSON.stringify(arr));
            }
        } catch (e) {}
        try { if (typeof onAdded === 'function') onAdded(name); } catch (e) {}
        close();
    };
}

function bindProjectStatusPlusButtonsOnce() {
    if (window.__RFQ_STATUS_PLUS_BOUND__) return;
    window.__RFQ_STATUS_PLUS_BOUND__ = true;
    document.addEventListener('click', (ev) => {
        const btn = ev.target && ev.target.closest ? ev.target.closest('[data-action="add-project-status"]') : null;
        if (!btn) return;
        ev.preventDefault();
        ev.stopPropagation();
        openAddProjectStatusModal(() => {
            // refresh all known selects
            try { fillProjectStatusSelect(getEl('new-project-status'), getCurrentProjectStatus()); } catch (e) {}
            try { fillProjectStatusSelect(getEl('edit-project-status'), getCurrentProjectStatus()); } catch (e) {}
            try { fillProjectStatusSelect(getEl('dash-project-status'), getCurrentProjectStatus()); } catch (e) {}
            try { fillProjectStatusSelect(getEl('projdetail-status'), getCurrentProjectStatus()); } catch (e) {}
        });
    }, true);
}
bindProjectStatusPlusButtonsOnce();

function renderDashboardProjectStatus() {
    const sel = getEl('dash-project-status');
    const pill = getEl('dash-project-status-pill');

    if (!currentProject) {
        if (sel) {
            fillProjectStatusSelect(sel, 'Created');
            sel.disabled = true;
        }
        if (pill) pill.textContent = 'Select a project';
        return;
    }

    if (sel) {
        sel.disabled = false;
        fillProjectStatusSelect(sel, getCurrentProjectStatus());
        if (!sel.dataset.bound) {
            sel.dataset.bound = '1';
            sel.onchange = () => setCurrentProjectStatus(sel.value);
        }
    }
    if (pill) pill.textContent = getCurrentProjectStatus();
}

function initApp() {
            // Load projects from storage
            if (typeof getProjects === 'function') {
                projects = getProjects();
            }

            renderSidebar();
            setupEventListeners();
            // Fill Project Status selects (New/Edit/Dashboard)
            try { fillProjectStatusSelect(getEl('new-project-status'), 'Created'); } catch (e) {}
            try { fillProjectStatusSelect(getEl('edit-project-status'), getCurrentProjectStatus()); } catch (e) {}
            try { renderDashboardProjectStatus(); } catch (e) {}
            showEmptyState();
            generateManualEntryForm();
            updateMenuTime();
            setInterval(updateMenuTime, 1000);

            // Restore last active project (standalone behavior: show picker if not found)
            const lastProjectId = localStorage.getItem('rfq_active_project_id');
            if (lastProjectId) {
                const found = projects.find(p => p.id === lastProjectId);
                if (found) {
                    currentProject = found;
                    openProject(found);
                }
            }

            // If no active project, show the Project Picker instead of auto-opening the first one.
            if (!currentProject) {
                const projectPicker = getEl('project-picker');
                if (projectPicker) {
                    projectPicker.classList.remove('hidden');
                    projectPicker.setAttribute('aria-hidden', 'false');
                }
                renderSidebarProjects();
                showEmptyState();
            }
        }

        function setupEventListeners() {
            const projectPicker = getEl('project-picker');
            const btnOpenProjectPicker = getEl('btn-open-project-picker');
            const btnCloseProjectPicker = getEl('btn-close-project-picker'); // Leave
            const btnOkProjectPicker = getEl('btn-project-picker-ok'); // OK

            const openProjectPicker = () => {
                if (!projectPicker) return;
                projectPickerIsOpen = true;
                projectPickerPendingId = currentProject ? currentProject.id : null;
                projectPicker.classList.remove('hidden');
                projectPicker.setAttribute('aria-hidden', 'false');
                renderSidebar(); // renders project list with pending selection
            };

            const closeProjectPicker = () => {
                if (!projectPicker) return;
                projectPickerIsOpen = false;
                projectPickerPendingId = null;
                projectPicker.classList.add('hidden');
                projectPicker.setAttribute('aria-hidden', 'true');
                renderSidebar(); // refresh active state
            };

            const applyProjectPickerSelection = () => {
                if (!projectPickerPendingId) return;
                const proj = (projects || []).find(p => String(p.id) === String(projectPickerPendingId));
                if (!proj) return;
                openProject(proj);
                closeProjectPicker();
            };

            if (btnOpenProjectPicker) btnOpenProjectPicker.onclick = openProjectPicker;
            if (btnCloseProjectPicker) btnCloseProjectPicker.onclick = closeProjectPicker;
            if (btnOkProjectPicker) btnOkProjectPicker.onclick = applyProjectPickerSelection;

            if (projectPicker) {
                projectPicker.addEventListener('click', (e) => {
                    if (e.target === projectPicker) closeProjectPicker();
                });
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && !projectPicker.classList.contains('hidden')) closeProjectPicker();
                });
            }
            // Navigation
            if (navMain) navMain.onclick = () => switchView('main');
            if (navData) navData.onclick = () => switchView('data');
            if (btnTopbarMain) btnTopbarMain.onclick = () => switchView('main');
            if (btnTopbarData) btnTopbarData.onclick = () => switchView('data');
            if (btnTopbarUploadQuote) btnTopbarUploadQuote.onclick = () => {
                try { switchView('suppliers'); } catch(e) {}
                setTimeout(() => {
                    const sel = getEl('bulk-supplier-select');
                    const supplierName = sel ? String(sel.value || '').trim() : '';
                    if (!supplierName) {
                        alert('Select supplier in Suppliers → Bulk Pricing first.');
                        try { if (sel) sel.focus(); } catch(e) {}
                        return;
                    }
                    const b = getEl('btn-upload-bulk-quote');
                    if (b) b.click();
                }, 60);
            };
            if (navDashboard) navDashboard.onclick = () => switchView('dashboard');
            if (navItems) navItems.onclick = () => switchView('items');
            if (navSuppliers) navSuppliers.onclick = () => switchView('suppliers');
            if (navSupplierList) navSupplierList.onclick = () => switchView('supplier-list');
            if (navProjectSuppliers) navProjectSuppliers.onclick = () => switchView('project-suppliers');
            if (navExport) navExport.onclick = () => switchView('export');
            if (navQuoting) navQuoting.onclick = () => switchView('quoting');
            if (navDatabase) navDatabase.onclick = () => switchView('database');
if (navDatabase) navDatabase.onclick = () => switchView('database');


// MAIN controls (global overview)
const btnMainRefresh = getEl('btn-main-refresh');
const btnMainExport = getEl('btn-main-export');
const mainTableBody = getEl('main-projects-tbody');
if (btnMainRefresh) btnMainRefresh.onclick = () => { try { renderMainOverview(); } catch (e) { console.error(e); } };
if (btnMainExport) btnMainExport.onclick = () => { try { exportMainProjectsCSV(); } catch (e) { console.error(e); } };



// DATA MANAGER controls
const btnDataRefresh = getEl('btn-data-refresh');
const btnDataExport = getEl('btn-data-export-json');
const btnDataImport = getEl('btn-data-import-json');
const btnDataReset = getEl('btn-data-reset');
const fileDataImport = getEl('file-data-import');

if (btnDataRefresh) btnDataRefresh.onclick = () => { try { renderDataManager(); } catch (e) { console.error(e); } };
if (btnDataExport) btnDataExport.onclick = () => { try { dmExportBackup(); } catch (e) { console.error(e); } };
if (btnDataImport) btnDataImport.onclick = () => { try { if (fileDataImport) fileDataImport.click(); } catch (e) { console.error(e); } };
if (btnDataReset) btnDataReset.onclick = () => { try { dmResetAllRFQ(); } catch (e) { console.error(e); } };

if (fileDataImport && !fileDataImport.dataset.listenerAdded) {
    fileDataImport.addEventListener('change', (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        dmImportBackupFile(f);
        e.target.value = '';
    });
    fileDataImport.dataset.listenerAdded = 'true';
}

if (mainTableBody) {
    mainTableBody.addEventListener('click', (e) => {
        const el = e.target && e.target.closest ? e.target.closest('[data-main-action]') : null;
        if (!el) return;
        const action = el.getAttribute('data-main-action');
        const pid = el.getAttribute('data-proj');
        if (!pid) return;
        const proj = (projects || []).find(p => String(p.id) === String(pid));
        if (!proj) return;
        openProject(proj);
        if (action === 'open-dashboard') switchView('dashboard');
        if (action === 'open-items') switchView('items');
        if (action === 'open-project-detail') switchView('project-detail');
    });
}

// Top Suppliers - click to open supplier detail
const mainTopSuppliersTbody = getEl('main-top-suppliers-tbody');
if (mainTopSuppliersTbody) {
    mainTopSuppliersTbody.addEventListener('click', (e) => {
        const el = e.target && e.target.closest ? e.target.closest('[data-main-action]') : null;
        if (!el) return;
        const action = el.getAttribute('data-main-action');
        if (action === 'open-supplier-detail') {
            const supplierName = el.getAttribute('data-supplier');
            if (supplierName && typeof openGlobalSupplierDetail === 'function') {
                openGlobalSupplierDetail(supplierName);
            }
        }
    });
}

// Upcoming Deadlines - click to open project, change to edit date
const upcomingDeadlinesEl = getEl('main-upcoming-deadlines');
if (upcomingDeadlinesEl) {
    upcomingDeadlinesEl.addEventListener('click', (e) => {
        const el = e.target && e.target.closest ? e.target.closest('[data-main-action]') : null;
        if (!el) return;
        const action = el.getAttribute('data-main-action');
        const pid = el.getAttribute('data-proj');
        if (!pid) return;

        if (action === 'open-dashboard') {
            const proj = (projects || []).find(p => String(p.id) === String(pid));
            if (proj) {
                openProject(proj);
                switchView('dashboard');
            }
        }
    });

    upcomingDeadlinesEl.addEventListener('change', (e) => {
        const el = e.target && e.target.closest ? e.target.closest('[data-main-action="edit-deadline"]') : null;
        if (!el) return;
        const pid = el.getAttribute('data-proj');
        if (!pid) return;
        const newDate = el.value;
        const proj = (projects || []).find(p => String(p.id) === String(pid));
        if (proj) {
            if (!proj.dates) proj.dates = {};
            proj.dates.deadline = newDate;
            proj.dates.Deadline = newDate;
            if (window.RFQData && typeof window.RFQData.updateProject === 'function') {
                window.RFQData.updateProject(proj);
            } else if (typeof updateProject === 'function') {
                updateProject(proj);
            }
            // Refresh the main view
            try { renderMainOverview(); } catch (ex) { console.error(ex); }
        }
    });
}

            const btnNew = getEl('btn-new-project');
            if (btnNew) btnNew.onclick = () => {
                sheetNewProject.classList.remove('hidden');
                inputNewProjectName.focus();
            };

            const btnZrušitProject = getEl('btn-cancel-project');
            const btnCreateProject = getEl('btn-create-project');
            if (btnZrušitProject) btnZrušitProject.onclick = () => sheetNewProject.classList.add('hidden');
            if (btnCreateProject) btnCreateProject.onclick = handleCreateProject;
            // Export button removed by user request

            // Dashboard interactivity

// Dashboard Notes / Comments
const btnDashNoteAdd = getEl('btn-dash-note-add');
const dashNotesText = getEl('dash-notes-text');
const dashNotesTbody = getEl('dash-notes-tbody');

if (btnDashNoteAdd) btnDashNoteAdd.onclick = () => {
    if (!currentProject) return;
    const txt = dashNotesText ? String(dashNotesText.value || '').trim() : '';
    if (!txt) return;
    if (!Array.isArray(currentProject.dashboard_notes)) currentProject.dashboard_notes = [];
    currentProject.dashboard_notes.unshift({
        id: (window.RFQData && window.RFQData.uid) ? window.RFQData.uid() : (Date.now() + '_' + Math.random().toString(16).slice(2)),
        text: txt,
        created_at: new Date().toISOString()
    });
    if (dashNotesText) dashNotesText.value = '';
    if (window.RFQData && typeof window.RFQData.updateProject === 'function') window.RFQData.updateProject(currentProject);
    else updateProject(currentProject);
    renderDashboardNotes();
};

if (dashNotesTbody) {
    dashNotesTbody.addEventListener('click', (e) => {
        const btn = e.target && e.target.closest ? e.target.closest('[data-dash-note-action]') : null;
        if (!btn) return;
        if (!currentProject) return;
        const action = btn.getAttribute('data-dash-note-action');
        const id = btn.getAttribute('data-id');
        if (!id) return;
        if (!Array.isArray(currentProject.dashboard_notes)) currentProject.dashboard_notes = [];
        const idx = currentProject.dashboard_notes.findIndex(n => n && String(n.id) === String(id));
        if (idx < 0) return;

        if (action === 'delete') {
            currentProject.dashboard_notes.splice(idx, 1);
        } else if (action === 'edit') {
            const cur = currentProject.dashboard_notes[idx];
            const next = prompt('Edit dashboard comment:', cur ? String(cur.text || '') : '');
            if (next === null) return;
            currentProject.dashboard_notes[idx] = { ...(cur || {}), text: String(next).trim() };
        }
        if (window.RFQData && typeof window.RFQData.updateProject === 'function') window.RFQData.updateProject(currentProject);
        else updateProject(currentProject);
        renderDashboardNotes();
    });
}


            const cardDone = getEl('dash-done-items');
            if (cardDone && cardDone.parentElement) cardDone.parentElement.onclick = () => {
                switchView('items');
                filterStatus.value = 'Done';
                applyFilters();
            };
            const cardPending = getEl('dash-pending-items');
            if (cardPending && cardPending.parentElement) cardPending.parentElement.onclick = () => {
                switchView('items');
                filterStatus.value = 'Pending';
                applyFilters();
            };
            const cardTotal = getEl('dash-total-items');
            if (cardTotal && cardTotal.parentElement) cardTotal.parentElement.onclick = () => {
                switchView('items');
                filterStatus.value = ''; // All
                applyFilters();
            };

            // Items View Actions
            const btnAddItem = getEl('btn-add-item');
            const btnFilterToggle = getEl('btn-filter-toggle');
            const btnExportExcel = getEl('btn-export-excel');
            const fileImport = getEl('file-import-excel');
            const sheetAddChoice = getEl('sheet-add-choice');

            if (btnAddItem) btnAddItem.onclick = () => {
                if (!currentProject) { alert('Select a project first'); return; }
                sheetAddChoice.classList.remove('hidden');
            };

            if (btnFilterToggle) btnFilterToggle.onclick = () => {
                const panel = getEl('filters-panel');
                if (panel) panel.classList.toggle('hidden');
            };

            if (btnExportExcel) btnExportExcel.onclick = exportToExcel;
            if (fileImport) fileImport.onchange = handleImportExcel;

            // Add Choice Modal
            const btnChoiceManual = getEl('btn-choice-manual');
            const btnChoiceImport = getEl('btn-choice-import');

            if (btnChoiceManual) btnChoiceManual.onclick = () => {
                sheetAddChoice.classList.add('hidden');
                openManualEntryForm();
            };
            if (btnChoiceImport) btnChoiceImport.onclick = () => {
                sheetAddChoice.classList.add('hidden');
                if (fileImport) fileImport.click();
            };

            window.onclick = (event) => {
                if (event.target === sheetAddChoice) sheetAddChoice.classList.add('hidden');
                if (event.target === sheetNewProject) sheetNewProject.classList.add('hidden');
            };

            // Manual Entry Form
            const btnZrušitManual = getEl('btn-cancel-manual');
            const btnUložitManual = getEl('btn-save-manual');
            if (btnZrušitManual) btnZrušitManual.onclick = () => sheetManualEntry.classList.add('hidden');
            if (btnUložitManual) btnUložitManual.onclick = saveManualEntry;

            // Detail Window
            const btnCloseDetail = getEl('btn-close-detail');
            const btnZrušitDetailFooter = getEl('btn-cancel-detail-footer');
            const btnUložitDetail = getEl('btn-save-detail');
            const btnDeleteDetail = getEl('btn-delete-detail');

            if (btnCloseDetail) btnCloseDetail.onclick = closeDetailWindow;
            if (btnZrušitDetailFooter) btnZrušitDetailFooter.onclick = closeDetailWindow;
            if (btnUložitDetail) btnUložitDetail.onclick = saveDetailChanges;
            if (btnDeleteDetail) btnDeleteDetail.onclick = deleteCurrentItem;

            // Filters
            if (tableFilter) tableFilter.addEventListener('input', () => { filterText = tableFilter.value.toLowerCase(); applyFilters(); });

            [filterStatus, filterSupplier, filterManufacturer, filterPriceMin, filterPriceMax].forEach(el => {
                if (el) el.addEventListener('change', applyFilters);
                if (el) el.addEventListener('input', applyFilters);
            });

            const btnClearFilters = getEl('btn-clear-filters');
            if (btnClearFilters) btnClearFilters.onclick = () => {
                filterStatus.value = '';
                filterSupplier.value = '';
                filterManufacturer.value = '';
                filterPriceMin.value = '';
                filterPriceMax.value = '';
                tableFilter.value = '';
                filterText = '';
                applyFilters();
            };

            // Database Search
            if (databaseSearch) databaseSearch.addEventListener('input', renderDatabase);
            if (databaseProjectFilter) databaseProjectFilter.addEventListener('change', renderDatabase);
            const btnRefreshDb = getEl('btn-refresh-db');
        const btnDbClearFilters = getEl('btn-db-clear-filters');
        const btnDbExportSelected = getEl('btn-db-export-selected');
        const btnDbClearSelection = getEl('btn-db-clear-selection');
        const dbSelectAll = getEl('db-select-all');
            if (btnRefreshDb) btnRefreshDb.onclick = renderDatabase;
            if (btnDbClearFilters) btnDbClearFilters.onclick = () => { try { if (databaseSearch) databaseSearch.value = ''; if (databaseProjectFilter) databaseProjectFilter.value = ''; renderDatabase(); } catch (e) {} };

            // Database selection + open detail
            if (btnDbExportSelected) btnDbExportSelected.onclick = () => { try { exportDatabaseSelection(); } catch (e) {} };
            if (btnDbClearSelection) btnDbClearSelection.onclick = () => { try { selectedDbParts.clear(); renderDatabase(); } catch (e) {} };

            if (dbSelectAll && !dbSelectAll.dataset.bound) {
                dbSelectAll.dataset.bound = '1';
                dbSelectAll.addEventListener('change', (e) => {
                    const checked = !!e.target.checked;
                    const boxes = Array.from(document.querySelectorAll('#table-database tbody .db-row-checkbox'));
                    const visible = boxes.filter(b => {
                        const tr = b.closest('tr');
                        return tr && tr.offsetParent !== null;
                    });
                    visible.forEach(b => {
                        b.checked = checked;
                        const k = String(b.getAttribute('data-db-key') || '').trim().toLowerCase();
                        if (!k) return;
                        if (checked) selectedDbParts.add(k); else selectedDbParts.delete(k);
                    });
                    updateDbSelectionUI();
                });
            }

            const dbTbody = document.querySelector('#table-database tbody');
            if (dbTbody && !dbTbody.dataset.bound) {
                dbTbody.dataset.bound = '1';

                dbTbody.addEventListener('change', (e) => {
                    const cb = e.target && e.target.classList && e.target.classList.contains('db-row-checkbox') ? e.target : null;
                    if (!cb) return;
                    const k = String(cb.getAttribute('data-db-key') || '').trim().toLowerCase();
                    if (!k) return;
                    if (cb.checked) selectedDbParts.add(k); else selectedDbParts.delete(k);
                    updateDbSelectionUI();
                });

                dbTbody.addEventListener('click', (e) => {
                    const tgt = e.target;
                    if (!tgt) return;
                    if (tgt.closest && tgt.closest('input.db-row-checkbox')) return;

                    const openCell = tgt.closest ? tgt.closest('.db-open-cell') : null;
                    if (openCell) {
                        const k = String(openCell.getAttribute('data-db-key') || '').trim().toLowerCase();
                        if (!k) return;
                        openDatabaseKey(k);
                        return;
                    }
                });
            }

            // Bulk Actions
            const checkSelectAll = getEl('select-all-items');
            if (checkSelectAll) checkSelectAll.addEventListener('change', (e) => toggleAllItems(e.target.checked));

            const btnBulkClear = getEl('btn-bulk-clear');
            if (btnBulkClear) btnBulkClear.onclick = () => {
                selectedItems.clear();
                const allChecks = document.querySelectorAll('.item-checkbox');
                allChecks.forEach(cb => cb.checked = false);
                updateBulkActionBar();
                const sa = getEl('select-all-items');
                if (sa) { sa.checked = false; sa.indeterminate = false; }
            };

            const btnBulkExport = getEl('btn-bulk-export');
            if (btnBulkExport) btnBulkExport.onclick = handleBulkExport;

            const selBulkStatus = getEl('bulk-status-select');
            if (selBulkStatus) selBulkStatus.onchange = (e) => handleBulkStatusChange(e.target.value);
        }

        function switchView(view) {
            currentView = view;

            [viewMain, viewDataManager, viewDashboard, viewProjectDetail, viewItems, viewItemDetail, viewSuppliers, viewProjectSuppliers, viewSupplierList, viewSupplierDetail, viewBundleDetail, viewQuoteCompare, viewExport, viewQuoting, viewDatabase].forEach(el => el && el.classList.add('hidden'));
            [navMain, navData, navDashboard, navItems, navSuppliers, navProjectSuppliers, navSupplierList, navQuoting, navDatabase, navExport].forEach(el => el && el.classList.remove('active'));

            if (view === 'main' && viewMain) {
                viewMain.classList.remove('hidden');
                if (navMain) navMain.classList.add('active');
                try { renderMainOverview(); } catch (e) { console.error(e); const me=getEl('main-error'); if (me){ me.textContent='MAIN render error: '+(e && e.message?e.message:String(e)); me.classList.remove('hidden'); } }
            } else if (view === 'data' && viewDataManager) {
                viewDataManager.classList.remove('hidden');
                if (navData) navData.classList.add('active');
                try { renderDataManager(); } catch (e) { console.error(e); alert('DATA render error: ' + (e && e.message ? e.message : String(e))); }
            } else if (view === 'dashboard' && viewDashboard) {
                viewDashboard.classList.remove('hidden');
                if (navDashboard) navDashboard.classList.add('active');
                renderDashboardProjects();
                renderDashboard();
            } else if (view === 'project-detail' && viewProjectDetail) {
                viewProjectDetail.classList.remove('hidden');
                // No nav tab is active for detail pages
                try { renderProjectDetail(); } catch (e) { console.error(e); }
            } else if (view === 'items' && viewItems) {
                viewItems.classList.remove('hidden');
                if (navItems) navItems.classList.add('active');
                renderCompactTable();
                updateStats();
                updateSupplierFilter();
                updateManufacturerFilter();
            } else if (view === 'suppliers' && viewSuppliers) {
                viewSuppliers.classList.remove('hidden');
                if (navSuppliers) navSuppliers.classList.add('active');
                if (typeof renderSuppliers === 'function') renderSuppliers();
            } else if (view === 'project-suppliers' && viewProjectSuppliers) {
                viewProjectSuppliers.classList.remove('hidden');
                if (navProjectSuppliers) navProjectSuppliers.classList.add('active');
                try { renderProjectSupplierList(); } catch (e) { console.error(e); }
            } else if (view === 'supplier-list' && viewSupplierList) {
                viewSupplierList.classList.remove('hidden');
                if (navSupplierList) navSupplierList.classList.add('active');
                renderGlobalSupplierList();
            } else if (view === 'supplier-detail' && viewSupplierDetail) {
                viewSupplierDetail.classList.remove('hidden');
                // No nav tab is active for detail pages
            } else if (view === 'bundle-detail' && viewBundleDetail) {
                viewBundleDetail.classList.remove('hidden');
                // No nav tab is active for detail pages
                try { renderBundleDetailPage(); } catch (e) { console.error(e); }
            } else if (view === 'quote-compare' && viewQuoteCompare) {
                viewQuoteCompare.classList.remove('hidden');
                // No nav tab is active for detail pages
                try { renderQuoteComparePage(); } catch (e) { console.error(e); }
            } else if (view === 'item-detail' && viewItemDetail) {
                viewItemDetail.classList.remove('hidden');
                // No nav tab is active for detail pages
            } else if (view === 'quoting' && viewQuoting) {
                viewQuoting.classList.remove('hidden');
                if (navQuoting) navQuoting.classList.add('active');
                renderQuotingView();
            } else if (view === 'export' && viewExport) {
                viewExport.classList.remove('hidden');
                if (navExport) navExport.classList.add('active');
                try { renderExportCenter(); } catch (e) { console.error(e); }
            } else if (view === 'database' && viewDatabase) {
                viewDatabase.classList.remove('hidden');
                if (navDatabase) navDatabase.classList.add('active');
                renderDatabase();
            }
        }


// =========================================================
// MAIN – Global Overview (across all projects)
// =========================================================

function mainParseIsoDate(v) {
    const s = String(v || '').trim();
    if (!s) return null;
    // accept yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        const d = new Date(s + 'T00:00:00');
        return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
}
// =========================================================
// DATA MANAGER – Local storage, backup, restore
// =========================================================

function dmFormatBytes(bytes){
    const b = Number(bytes) || 0;
    if (b < 1024) return b + ' B';
    if (b < 1024*1024) return (b/1024).toFixed(1) + ' KB';
    return (b/(1024*1024)).toFixed(2) + ' MB';
}

function dmGetProjectsRaw(){
    try {
        if (window.RFQData && typeof window.RFQData.getProjects === 'function') return window.RFQData.getProjects();
    } catch (e) {}
    try {
        const raw = localStorage.getItem('rfq_projects_v1');
        return raw ? JSON.parse(raw) : [];
    } catch (e) {}
    return [];
}

function dmSetProjectsRaw(projects){
    try {
        localStorage.setItem('rfq_projects_v1', JSON.stringify(Array.isArray(projects) ? projects : []));
        try { if (window.RFQData && typeof window.RFQData.syncNow === 'function') window.RFQData.syncNow(); } catch(e){}
        return true;
    } catch (e) { console.error(e); return false; }
}

function dmMergeProjects(existing, incoming){
    const ex = Array.isArray(existing) ? existing : [];
    const inc = Array.isArray(incoming) ? incoming : [];
    const map = new Map();
    ex.forEach(p => { if (p && p.id) map.set(String(p.id), p); });
    inc.forEach(p => { if (p && p.id) map.set(String(p.id), p); });
    return Array.from(map.values());
}

function renderDataManager(){
    const cards = getEl('data-manager-cards');
    const tb = getEl('table-data-keys') ? getEl('table-data-keys').querySelector('tbody') : null;
    if (!cards || !tb) return;

    const projectsRaw = dmGetProjectsRaw();
    const projectsCount = Array.isArray(projectsRaw) ? projectsRaw.length : 0;
    const itemsCount = (Array.isArray(projectsRaw) ? projectsRaw.reduce((acc,p)=> acc + (Array.isArray(p.items)?p.items.length:0), 0) : 0);
    const activeId = localStorage.getItem('rfq_active_project_id') || '';

    // localStorage key sizes
    const keys = [];
    let totalBytes = 0;
    for (let i=0; i<localStorage.length; i++){
        const k = localStorage.key(i);
        const v = localStorage.getItem(k) || '';
        const bytes = (k.length + v.length) * 2; // rough UTF-16 bytes
        totalBytes += bytes;
        keys.push({ key:k, bytes, preview: v.slice(0, 120) });
    }
    keys.sort((a,b)=> a.key.localeCompare(b.key));

    cards.innerHTML = `
      <div class="main-grid" style="grid-template-columns: repeat(4, 1fr); gap: 12px;">
        <div class="main-kpi"><div class="main-kpi-label">Build</div><div class="main-kpi-value">${window.__RFQ_BUILD_VERSION__ || '-'}</div></div>
        <div class="main-kpi"><div class="main-kpi-label">Projects</div><div class="main-kpi-value">${projectsCount}</div></div>
        <div class="main-kpi"><div class="main-kpi-label">Items</div><div class="main-kpi-value">${itemsCount}</div></div>
        <div class="main-kpi"><div class="main-kpi-label">LocalStorage Size</div><div class="main-kpi-value">${dmFormatBytes(totalBytes)}</div></div>
      </div>
      <div class="main-card" style="margin-top:12px;">
        <div class="main-card-title">Active Project</div>
        <div style="font-size:12px; color:#444; padding:6px 2px;">
          <b>ID:</b> ${activeId || '-'} 
        </div>
      </div>
    `;

    tb.innerHTML = keys.map(k => `
      <tr>
        <td style="font-weight:600;">${k.key}</td>
        <td>${dmFormatBytes(k.bytes)}</td>
        <td style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size: 11px; color:#555;">
          ${String(k.preview || '').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
        </td>
      </tr>
    `).join('');
}

function dmDownloadJson(obj, filename){
    try {
        const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 0);
    } catch (e) { console.error(e); alert('Export failed: ' + (e && e.message ? e.message : String(e))); }
}

function dmExportBackup(){
    const payload = {
        schema: 'rfq_backup_v1',
        created_at: new Date().toISOString(),
        build: window.__RFQ_BUILD_VERSION__ || '',
        active_project_id: localStorage.getItem('rfq_active_project_id') || '',
        projects: dmGetProjectsRaw()
    };
    const ts = payload.created_at.replace(/[:.]/g,'-');
    dmDownloadJson(payload, `rfq_backup_${ts}.json`);
}

function dmImportBackupFile(file){
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const parsed = JSON.parse(String(ev.target.result || ''));
            if (!parsed || !Array.isArray(parsed.projects)) throw new Error('Invalid backup format (missing projects[])');
            const existing = dmGetProjectsRaw();
            const merged = dmMergeProjects(existing, parsed.projects);
            if (!dmSetProjectsRaw(merged)) throw new Error('Failed to write rfq_projects_v1');
            if (parsed.active_project_id) localStorage.setItem('rfq_active_project_id', String(parsed.active_project_id));
            // refresh in-memory + UI
            try { projects = getAllProjectsSafe(); } catch(e){}
            try { if (typeof renderSidebar === 'function') renderSidebar(); } catch(e){}
            try { if (typeof renderSidebarProjects === 'function') renderSidebarProjects(); } catch(e){}
            alert('Import OK. Projects merged: ' + merged.length);
            try { renderDataManager(); } catch(e){}
        } catch (e) {
            console.error(e);
            alert('Import failed: ' + (e && e.message ? e.message : String(e)));
        }
    };
    reader.readAsText(file);
}

function dmResetAllRFQ(){
    const ok = confirm('This will remove all RFQ data from this browser (projects, items, suppliers, quotes). Continue?');
    if (!ok) return;
    const toRemove = [];
    for (let i=0; i<localStorage.length; i++){
        const k = localStorage.key(i);
        if (k && (k.startsWith('rfq_') || k.toLowerCase().includes('rfq'))) toRemove.push(k);
    }
    toRemove.forEach(k => { try { localStorage.removeItem(k); } catch(e){} });
    
    // also reset server storage (Django)
    try {
        fetch('/api/projects/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin' }).catch(()=>{});
    } catch(e){}
alert('RFQ data cleared. Reloading…');
    location.reload();
}


function mainFmtYMD(d) {
    if (!d) return '';
    try {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    } catch { return ''; }
}

function getAllProjectsSafe() {
    try {
        if (window.RFQData && typeof window.RFQData.getProjects === 'function') return window.RFQData.getProjects();
        if (typeof getProjects === 'function') return getProjects();
    } catch (e) { console.error(e); }
    return Array.isArray(projects) ? projects : [];
}

function getProjectBundlesSafe(p) {
    if (!p || typeof p !== 'object') return [];
    if (Array.isArray(p.rfqBatches)) return p.rfqBatches;
    if (Array.isArray(p.rfq_batches)) return p.rfq_batches;
    return [];
}

function getProjectSuppliersCountSafe(p) {
    const set = new Set();
    const master = Array.isArray(p && p.supplierMaster) ? p.supplierMaster : [];
    master.forEach(s => { if (s && (s.name || s.supplier)) set.add(String(s.name || s.supplier)); });
    const items = Array.isArray(p && p.items) ? p.items : [];
    items.forEach(it => {
        if (!it) return;
        const supArr = Array.isArray(it.suppliers) ? it.suppliers : [];
        supArr.forEach(s => {
            const nm = s && (s.supplier || s.name || s.company);
            if (nm) set.add(String(nm));
        });
        if (it.supplier) set.add(String(it.supplier));
        if (it.main_supplier) set.add(String(it.main_supplier));
    });
    return set.size;
}

function isBundleOpen(b) {
    const st = String((b && b.status) ? b.status : '').toLowerCase();
    if (!st) return true;
    return !(st.includes('closed') || st.includes('done') || st.includes('archiv'));
}

function renderMainOverview() {
    const errEl = getEl('main-error');
    if (errEl) { errEl.textContent = ''; errEl.classList.add('hidden'); }

    projects = getAllProjectsSafe();

    const list = Array.isArray(projects) ? projects : [];
    const tb = getEl('main-projects-tbody');
    const tbSup = getEl('main-top-suppliers-tbody');

    const kProjects = getEl('main-kpi-projects');
    const kItems = getEl('main-kpi-items');
    const kSuppliers = getEl('main-kpi-suppliers');
    const kOpenBundles = getEl('main-kpi-open-bundles');
    const kValue = getEl('main-kpi-value');

    const kOverdue = getEl('main-overdue');
    const kDue7 = getEl('main-due-7');
    const kDueSoon = getEl('main-due-soon');
    const kRecent = getEl('main-recent');

    const statusBreakdown = getEl('main-status-breakdown');
    const upcomingDeadlines = getEl('main-upcoming-deadlines');

    let totalItems = 0;
    let totalSuppliers = 0;
    let totalOpenBundles = 0;
    let totalValue = 0;

    const today = new Date();
    const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    let overdue = 0;
    let due7 = 0;
    let dueSoon = 0;
    let mostRecent = null;

    const statusCounts = {};
    const deadlinesList = [];

    // Aggregate suppliers across projects
    const supplierAgg = new Map(); // name -> {bundles, items, value}
    const rows = list.map(p => {
        const itemsArr = Array.isArray(p.items) ? p.items : [];
        const items = itemsArr.length;
        const suppliers = getProjectSuppliersCountSafe(p);
        const bundles = getProjectBundlesSafe(p);
        const openBundles = bundles.filter(isBundleOpen).length;

        // Calculate project value and quote rate
        let projValue = 0;
        let quotedItems = 0;
        itemsArr.forEach(it => {
            const p1 = parseFloat(it.price_1_euro || it.price_1 || 0) || 0;
            const q1 = parseFloat(it.qty_1 || 1) || 1;
            projValue += p1 * q1;
            const st = String(it.status || '').toLowerCase();
            if (st.includes('quote') || st.includes('won') || st.includes('done')) quotedItems++;
        });
        const quoteRate = items > 0 ? Math.round((quotedItems / items) * 100) : 0;

        totalItems += items;
        totalSuppliers += suppliers;
        totalOpenBundles += openBundles;
        totalValue += projValue;

        // Project status count
        const ps = p.project_status || 'Created';
        statusCounts[ps] = (statusCounts[ps] || 0) + 1;

        // deadline / due
        const deadlineStr = p && p.dates ? (p.dates.deadline || p.dates.Deadline || '') : '';
        const d = mainParseIsoDate(deadlineStr);
        let diffDays = null;
        if (d) {
            const t = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
            diffDays = Math.ceil((t - t0) / (24 * 3600 * 1000));
            if (diffDays < 0) overdue += 1;
            else if (diffDays <= 7) due7 += 1;
            else if (diffDays <= 14) dueSoon += 1;

            if (diffDays >= 0 && diffDays <= 30) {
                deadlinesList.push({ name: p.name || 'Untitled', id: p.id, deadline: deadlineStr, days: diffDays });
            }
        }

        // recently updated
        const upd = p.updated_at || p.created_at || '';
        const ud = mainParseIsoDate(upd);
        if (ud && (!mostRecent || ud.getTime() > mostRecent.getTime())) mostRecent = ud;

        // supplier agg
        bundles.forEach(b => {
            const sup = String((b && (b.supplier || b.supplier_name || b.supplierName)) || '').trim();
            if (!sup) return;
            const rec = supplierAgg.get(sup) || { bundles: 0, items: 0, value: 0 };
            rec.bundles += 1;
            const lines = Array.isArray(b && b.items) ? b.items.length : 0;
            rec.items += lines;
            supplierAgg.set(sup, rec);
        });

        // Also aggregate item suppliers
        itemsArr.forEach(it => {
            const sup = String(it.supplier || '').trim();
            if (!sup) return;
            const rec = supplierAgg.get(sup) || { bundles: 0, items: 0, value: 0 };
            rec.items += 1;
            const p1 = parseFloat(it.price_1_euro || it.price_1 || 0) || 0;
            const q1 = parseFloat(it.qty_1 || 1) || 1;
            rec.value += p1 * q1;
            supplierAgg.set(sup, rec);
        });

        const sentTo = p && p.dates ? (p.dates.sent_to || p.dates.sentTo || '') : '';
        return {
            id: p.id,
            name: p.name || 'Untitled',
            status: ps,
            items,
            value: projValue,
            suppliers,
            bundles: bundles.length,
            quoteRate,
            deadline: deadlineStr,
            deadlineDays: diffDays,
            sentTo: String(sentTo || '').trim()
        };
    });

    // Update KPIs
    if (kProjects) kProjects.textContent = String(list.length);
    if (kItems) kItems.textContent = String(totalItems);
    if (kSuppliers) kSuppliers.textContent = String(totalSuppliers);
    if (kOpenBundles) kOpenBundles.textContent = String(totalOpenBundles);
    if (kValue) kValue.textContent = '€' + totalValue.toLocaleString('en-US', {minimumFractionDigits:0, maximumFractionDigits:0});

    if (kOverdue) kOverdue.textContent = String(overdue);
    if (kDue7) kDue7.textContent = String(due7);
    if (kDueSoon) kDueSoon.textContent = String(dueSoon);
    if (kRecent) kRecent.textContent = mostRecent ? ('Last update: ' + mainFmtYMD(mostRecent)) : 'Last update: —';

    // Status breakdown
    if (statusBreakdown) {
        const total = list.length || 1;
        const statusColors = {
            'Created': '#6c757d',
            'In process': '#007bff',
            'Done': '#28a745'
        };
        statusBreakdown.innerHTML = Object.entries(statusCounts).map(([st, cnt]) => {
            const pct = Math.round((cnt / total) * 100);
            const color = statusColors[st] || '#6c757d';
            return `
                <div style="display:flex; align-items:center; gap:8px;">
                    <div style="flex:1; height:8px; background:#e9ecef; border-radius:4px; overflow:hidden;">
                        <div style="width:${pct}%; height:100%; background:${color};"></div>
                    </div>
                    <span style="font-size:11px; min-width:80px;">${escapeHtml(st)}</span>
                    <span style="font-size:11px; font-weight:700; min-width:30px;">${cnt}</span>
                </div>
            `;
        }).join('') || '<div style="color:#999; font-size:12px;">No projects</div>';
    }

    // Upcoming deadlines - with editable date and project links
    if (upcomingDeadlines) {
        deadlinesList.sort((a, b) => a.days - b.days);
        upcomingDeadlines.innerHTML = deadlinesList.slice(0, 8).map(d => {
            let color = '#333';
            let bg = '#f8f9fa';
            if (d.days <= 3) { color = '#721c24'; bg = '#f8d7da'; }
            else if (d.days <= 7) { color = '#856404'; bg = '#fff3cd'; }
            return `
                <div class="deadline-item" style="background:${bg}; color:${color};">
                    <span class="deadline-item-name" data-main-action="open-dashboard" data-proj="${escapeHtml(String(d.id))}">${escapeHtml(d.name)}</span>
                    <div class="deadline-item-date">
                        <input type="date" value="${escapeHtml(d.deadline)}" data-main-action="edit-deadline" data-proj="${escapeHtml(String(d.id))}" onclick="event.stopPropagation();" title="Click to change deadline">
                        <span>(${d.days}d)</span>
                        <button class="btn-open-project" data-main-action="open-dashboard" data-proj="${escapeHtml(String(d.id))}" onclick="event.stopPropagation();">Open</button>
                    </div>
                </div>
            `;
        }).join('') || '<div style="color:#999; font-size:12px; padding:10px;">No upcoming deadlines</div>';
    }

    // Projects table
    if (tb) {
        if (!rows.length) {
            tb.innerHTML = '<tr><td colspan="10" style="padding:30px; text-align:center; color:#6b7280; font-size:14px;">No projects found. Click "+ New Project" to create one.</td></tr>';
        } else {
            tb.innerHTML = rows.map(r => {
                // Status badge color
                const stL = String(r.status).toLowerCase();
                let stColor = '#6c757d', stBg = '#e9ecef';
                if (stL.includes('process') || stL.includes('active')) { stColor = '#004085'; stBg = '#cce5ff'; }
                else if (stL.includes('done') || stL.includes('completed')) { stColor = '#155724'; stBg = '#d4edda'; }

                // Deadline class
                let dlClass = '';
                if (r.deadlineDays !== null) {
                    if (r.deadlineDays < 0) dlClass = 'deadline-overdue';
                    else if (r.deadlineDays <= 7) dlClass = 'deadline-urgent';
                    else if (r.deadlineDays <= 14) dlClass = 'deadline-soon';
                }

                return `
                    <tr>
                        <td>
                            <div class="proj-name" data-main-action="open-dashboard" data-proj="${escapeHtml(String(r.id))}">${escapeHtml(String(r.name))}</div>
                        </td>
                        <td><span class="status-badge" style="background:${stBg}; color:${stColor};">${escapeHtml(r.status)}</span></td>
                        <td style="text-align:center; font-weight:600; font-size:15px;">${r.items}</td>
                        <td class="value-col" style="text-align:right;">€${r.value.toLocaleString('en-US', {minimumFractionDigits:0, maximumFractionDigits:0})}</td>
                        <td style="text-align:center; font-size:14px;">${r.suppliers}</td>
                        <td style="text-align:center; font-size:14px;">${r.bundles}</td>
                        <td>
                            <div class="quote-bar-wrap">
                                <div class="quote-bar">
                                    <div class="quote-bar-fill" style="width:${r.quoteRate}%; background:${r.quoteRate >= 80 ? '#28a745' : r.quoteRate >= 50 ? '#ffc107' : '#dc3545'};"></div>
                                </div>
                                <span class="quote-pct">${r.quoteRate}%</span>
                            </div>
                        </td>
                        <td class="${dlClass}" style="font-size:14px;">${escapeHtml(String(r.deadline || '—'))}</td>
                        <td style="max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:13px;" title="${escapeAttr(r.sentTo)}">${escapeHtml(String(r.sentTo || '—'))}</td>
                        <td style="white-space:nowrap; text-align:center;">
                            <button class="btn-table btn-table-primary" data-main-action="open-dashboard" data-proj="${escapeHtml(String(r.id))}">Open</button>
                            <button class="btn-table btn-table-secondary" data-main-action="open-project-detail" data-proj="${escapeHtml(String(r.id))}">Detail</button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }

    // Top suppliers - with clickable links to supplier detail
    if (tbSup) {
        const top = Array.from(supplierAgg.entries())
            .map(([name, rec]) => ({ name, bundles: rec.bundles, items: rec.items, value: rec.value }))
            .sort((a, b) => (b.value - a.value) || (b.bundles - a.bundles))
            .slice(0, 10);
        if (!top.length) {
            tbSup.innerHTML = '<tr><td colspan="4" class="muted" style="padding:12px;">No supplier data yet.</td></tr>';
        } else {
            tbSup.innerHTML = top.map(r => `
                <tr>
                    <td><span class="supplier-link" data-main-action="open-supplier-detail" data-supplier="${escapeHtml(String(r.name))}">${escapeHtml(String(r.name))}</span></td>
                    <td style="text-align:center;">${r.bundles}</td>
                    <td style="text-align:center;">${r.items}</td>
                    <td style="text-align:right;">€${r.value.toLocaleString('en-US', {minimumFractionDigits:0, maximumFractionDigits:0})}</td>
                </tr>
            `).join('');
        }
    }

    // Bind filter events
    const filterInput = getEl('main-filter');
    const statusFilter = getEl('main-status-filter');
    const newProjectBtn = getEl('btn-main-new-project');

    if (filterInput && !filterInput.dataset.bound) {
        filterInput.dataset.bound = '1';
        filterInput.oninput = () => filterMainProjects();
    }
    if (statusFilter && !statusFilter.dataset.bound) {
        statusFilter.dataset.bound = '1';
        statusFilter.onchange = () => filterMainProjects();
    }
    if (newProjectBtn && !newProjectBtn.dataset.bound) {
        newProjectBtn.dataset.bound = '1';
        newProjectBtn.onclick = () => { try { openNewProjectModal(); } catch(e) {} };
    }

    // Initialize resizable columns
    initMainTableResizableColumns();

    // Initialize pagination for main projects table
    setTimeout(() => {
        initTablePagination('main-projects-table', { storageKey: 'rfq_main_projects_page' });
    }, 50);
}

// =========================================================
// Resizable Columns for Main Projects Table
// =========================================================
const MAIN_TABLE_COL_WIDTHS_KEY = 'rfq_main_table_col_widths';

function getMainTableColumnWidths() {
    try {
        const saved = localStorage.getItem(MAIN_TABLE_COL_WIDTHS_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
}

function saveMainTableColumnWidths(widths) {
    try {
        localStorage.setItem(MAIN_TABLE_COL_WIDTHS_KEY, JSON.stringify(widths));
    } catch (e) {}
}

function initMainTableResizableColumns() {
    const table = document.querySelector('.main-projects-table');
    if (!table) return;

    const thead = table.querySelector('thead');
    if (!thead) return;

    const ths = thead.querySelectorAll('th');
    if (!ths.length) return;

    // Apply saved widths
    const savedWidths = getMainTableColumnWidths();
    ths.forEach((th, idx) => {
        if (savedWidths[idx]) {
            th.style.width = savedWidths[idx] + 'px';
            th.style.minWidth = savedWidths[idx] + 'px';
        }
        // Add resize handle if not already present
        if (!th.querySelector('.col-resize-handle')) {
            const handle = document.createElement('div');
            handle.className = 'col-resize-handle';
            handle.dataset.colIdx = String(idx);
            th.appendChild(handle);
        }
    });

    // Attach resize handlers (only once)
    if (table.dataset.resizeInit) return;
    table.dataset.resizeInit = '1';

    let resizing = false;
    let startX = 0;
    let startWidth = 0;
    let currentTh = null;
    let currentIdx = -1;

    const onMouseMove = (e) => {
        if (!resizing || !currentTh) return;
        const diff = e.clientX - startX;
        const newWidth = Math.max(50, startWidth + diff);
        currentTh.style.width = newWidth + 'px';
        currentTh.style.minWidth = newWidth + 'px';
    };

    const onMouseUp = () => {
        if (!resizing) return;
        resizing = false;
        table.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        // Save widths
        const widths = {};
        thead.querySelectorAll('th').forEach((th, idx) => {
            widths[idx] = th.offsetWidth;
        });
        saveMainTableColumnWidths(widths);

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    table.addEventListener('mousedown', (e) => {
        const handle = e.target.closest('.col-resize-handle');
        if (!handle) return;

        e.preventDefault();
        resizing = true;
        currentIdx = parseInt(handle.dataset.colIdx);
        currentTh = ths[currentIdx];
        startX = e.clientX;
        startWidth = currentTh.offsetWidth;

        table.classList.add('resizing');
        handle.classList.add('resizing');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // Also add drag & drop for column reordering
    initTableColumnDragging(table, 'rfq_main_table_');
}

// =========================================================
// Generic Resizable & Draggable Columns for Any Table
// =========================================================

function getTableSettings(storageKey) {
    try {
        const saved = localStorage.getItem(storageKey + 'settings');
        return saved ? JSON.parse(saved) : { widths: {}, order: [] };
    } catch (e) { return { widths: {}, order: [] }; }
}

function saveTableSettings(storageKey, settings) {
    try {
        localStorage.setItem(storageKey + 'settings', JSON.stringify(settings));
    } catch (e) {}
}

function initResizableDraggableTable(tableId, storageKey) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const thead = table.querySelector('thead');
    if (!thead) return;

    const headerRow = thead.querySelector('tr');
    if (!headerRow) return;

    const ths = headerRow.querySelectorAll('th');
    if (!ths.length) return;

    // Load saved settings
    const settings = getTableSettings(storageKey);

    // Apply saved column order
    if (settings.order && settings.order.length === ths.length) {
        const thsArray = Array.from(ths);
        const orderedThs = settings.order.map(colId => thsArray.find(th => th.dataset.colId === colId)).filter(Boolean);
        if (orderedThs.length === ths.length) {
            orderedThs.forEach(th => headerRow.appendChild(th));
            // Also reorder body columns
            const tbody = table.querySelector('tbody');
            if (tbody) {
                tbody.querySelectorAll('tr').forEach(row => {
                    const tds = Array.from(row.querySelectorAll('td'));
                    if (tds.length === ths.length) {
                        settings.order.forEach((colId, newIdx) => {
                            const origIdx = thsArray.findIndex(th => th.dataset.colId === colId);
                            if (origIdx >= 0 && tds[origIdx]) {
                                row.appendChild(tds[origIdx]);
                            }
                        });
                    }
                });
            }
        }
    }

    // Apply saved widths
    const currentThs = headerRow.querySelectorAll('th');
    currentThs.forEach((th, idx) => {
        const colId = th.dataset.colId || String(idx);
        if (settings.widths && settings.widths[colId]) {
            th.style.width = settings.widths[colId] + 'px';
            th.style.minWidth = settings.widths[colId] + 'px';
        }

        // Add resize handle if not present
        if (!th.querySelector('.col-resize-handle')) {
            const handle = document.createElement('div');
            handle.className = 'col-resize-handle';
            handle.dataset.colIdx = String(idx);
            th.appendChild(handle);
        }
    });

    // Skip if already initialized
    if (table.dataset.resizeDragInit) return;
    table.dataset.resizeDragInit = '1';

    // ===== RESIZE HANDLERS =====
    let resizing = false;
    let resizeStartX = 0;
    let resizeStartWidth = 0;
    let resizeTh = null;

    const onResizeMove = (e) => {
        if (!resizing || !resizeTh) return;
        const diff = e.clientX - resizeStartX;
        const newWidth = Math.max(50, resizeStartWidth + diff);
        resizeTh.style.width = newWidth + 'px';
        resizeTh.style.minWidth = newWidth + 'px';
    };

    const onResizeUp = () => {
        if (!resizing) return;
        resizing = false;
        table.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        // Save widths
        const widths = {};
        headerRow.querySelectorAll('th').forEach((th) => {
            const colId = th.dataset.colId || '';
            if (colId) widths[colId] = th.offsetWidth;
        });
        const s = getTableSettings(storageKey);
        s.widths = widths;
        saveTableSettings(storageKey, s);

        document.removeEventListener('mousemove', onResizeMove);
        document.removeEventListener('mouseup', onResizeUp);
    };

    table.addEventListener('mousedown', (e) => {
        const handle = e.target.closest('.col-resize-handle');
        if (!handle) return;

        e.preventDefault();
        e.stopPropagation();
        resizing = true;
        resizeTh = handle.closest('th');
        resizeStartX = e.clientX;
        resizeStartWidth = resizeTh.offsetWidth;

        table.classList.add('resizing');
        handle.classList.add('resizing');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        document.addEventListener('mousemove', onResizeMove);
        document.addEventListener('mouseup', onResizeUp);
    });

    // ===== DRAG & DROP HANDLERS =====
    let draggedTh = null;
    let draggedIdx = -1;

    currentThs.forEach((th, idx) => {
        th.draggable = true;
        th.dataset.origIdx = String(idx);

        th.addEventListener('dragstart', (e) => {
            // Don't start drag if resizing
            if (resizing) {
                e.preventDefault();
                return;
            }
            draggedTh = th;
            draggedIdx = idx;
            th.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', th.dataset.colId || String(idx));
        });

        th.addEventListener('dragend', () => {
            th.classList.remove('dragging');
            headerRow.querySelectorAll('th').forEach(t => t.classList.remove('drag-over'));
            draggedTh = null;
            draggedIdx = -1;
        });

        th.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!draggedTh || draggedTh === th) return;
            e.dataTransfer.dropEffect = 'move';
            th.classList.add('drag-over');
        });

        th.addEventListener('dragleave', () => {
            th.classList.remove('drag-over');
        });

        th.addEventListener('drop', (e) => {
            e.preventDefault();
            th.classList.remove('drag-over');
            if (!draggedTh || draggedTh === th) return;

            // Swap columns
            const allThs = Array.from(headerRow.querySelectorAll('th'));
            const fromIdx = allThs.indexOf(draggedTh);
            const toIdx = allThs.indexOf(th);

            if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return;

            // Reorder header
            if (fromIdx < toIdx) {
                headerRow.insertBefore(draggedTh, th.nextSibling);
            } else {
                headerRow.insertBefore(draggedTh, th);
            }

            // Reorder body cells
            const tbody = table.querySelector('tbody');
            if (tbody) {
                tbody.querySelectorAll('tr').forEach(row => {
                    const tds = Array.from(row.querySelectorAll('td'));
                    if (tds.length <= Math.max(fromIdx, toIdx)) return;
                    const fromTd = tds[fromIdx];
                    const toTd = tds[toIdx];
                    if (!fromTd || !toTd) return;

                    if (fromIdx < toIdx) {
                        row.insertBefore(fromTd, toTd.nextSibling);
                    } else {
                        row.insertBefore(fromTd, toTd);
                    }
                });
            }

            // Save order
            const newOrder = Array.from(headerRow.querySelectorAll('th')).map(t => t.dataset.colId || '');
            const s = getTableSettings(storageKey);
            s.order = newOrder;
            saveTableSettings(storageKey, s);
        });
    });
}

function initTableColumnDragging(table, storageKey) {
    if (!table) return;
    const thead = table.querySelector('thead');
    if (!thead) return;
    const headerRow = thead.querySelector('tr');
    if (!headerRow) return;
    const ths = headerRow.querySelectorAll('th');
    if (!ths.length) return;

    // Skip if already initialized for dragging
    if (table.dataset.dragInit) return;
    table.dataset.dragInit = '1';

    // Load saved order
    const settings = getTableSettings(storageKey);

    // Add col-id if not present
    ths.forEach((th, idx) => {
        if (!th.dataset.colId) {
            th.dataset.colId = 'col_' + idx;
        }
        // Add drag handle if not present
        if (!th.querySelector('.col-drag-handle')) {
            const handle = document.createElement('span');
            handle.className = 'col-drag-handle';
            handle.textContent = '⋮⋮';
            th.insertBefore(handle, th.firstChild);
        }
    });

    // Apply saved order
    if (settings.order && settings.order.length === ths.length) {
        const thsArray = Array.from(ths);
        const orderedThs = settings.order.map(colId => thsArray.find(th => th.dataset.colId === colId)).filter(Boolean);
        if (orderedThs.length === ths.length) {
            orderedThs.forEach(th => headerRow.appendChild(th));
            // Also reorder body columns
            const tbody = table.querySelector('tbody');
            if (tbody) {
                tbody.querySelectorAll('tr').forEach(row => {
                    const tds = Array.from(row.querySelectorAll('td'));
                    if (tds.length === ths.length) {
                        settings.order.forEach((colId) => {
                            const origIdx = thsArray.findIndex(th => th.dataset.colId === colId);
                            if (origIdx >= 0 && tds[origIdx]) {
                                row.appendChild(tds[origIdx]);
                            }
                        });
                    }
                });
            }
        }
    }

    // Drag & Drop handlers
    let draggedTh = null;

    const currentThs = headerRow.querySelectorAll('th');
    currentThs.forEach((th, idx) => {
        th.draggable = true;

        th.addEventListener('dragstart', (e) => {
            draggedTh = th;
            th.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', th.dataset.colId || String(idx));
        });

        th.addEventListener('dragend', () => {
            th.classList.remove('dragging');
            headerRow.querySelectorAll('th').forEach(t => t.classList.remove('drag-over'));
            draggedTh = null;
        });

        th.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!draggedTh || draggedTh === th) return;
            e.dataTransfer.dropEffect = 'move';
            th.classList.add('drag-over');
        });

        th.addEventListener('dragleave', () => {
            th.classList.remove('drag-over');
        });

        th.addEventListener('drop', (e) => {
            e.preventDefault();
            th.classList.remove('drag-over');
            if (!draggedTh || draggedTh === th) return;

            const allThs = Array.from(headerRow.querySelectorAll('th'));
            const fromIdx = allThs.indexOf(draggedTh);
            const toIdx = allThs.indexOf(th);

            if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return;

            // Reorder header
            if (fromIdx < toIdx) {
                headerRow.insertBefore(draggedTh, th.nextSibling);
            } else {
                headerRow.insertBefore(draggedTh, th);
            }

            // Reorder body cells
            const tbody = table.querySelector('tbody');
            if (tbody) {
                tbody.querySelectorAll('tr').forEach(row => {
                    const tds = Array.from(row.querySelectorAll('td'));
                    if (tds.length <= Math.max(fromIdx, toIdx)) return;
                    const fromTd = tds[fromIdx];
                    const toTd = tds[toIdx];
                    if (!fromTd || !toTd) return;

                    if (fromIdx < toIdx) {
                        row.insertBefore(fromTd, toTd.nextSibling);
                    } else {
                        row.insertBefore(fromTd, toTd);
                    }
                });
            }

            // Save order
            const newOrder = Array.from(headerRow.querySelectorAll('th')).map(t => t.dataset.colId || '');
            const s = getTableSettings(storageKey);
            s.order = newOrder;
            saveTableSettings(storageKey, s);
        });
    });
}

// =========================================================
// Pagination Component
// =========================================================
const PAGINATION_PAGE_SIZE = 100;

function createPagination(tableId, options = {}) {
    const table = document.getElementById(tableId);
    if (!table) return null;

    const tbody = table.querySelector('tbody');
    if (!tbody) return null;

    const pageSize = options.pageSize || PAGINATION_PAGE_SIZE;
    const storageKey = options.storageKey || `pagination_${tableId}`;

    let currentPage = 1;
    try {
        const saved = localStorage.getItem(storageKey);
        if (saved) currentPage = parseInt(saved) || 1;
    } catch (e) {}

    const paginationState = {
        currentPage,
        pageSize,
        totalRows: 0,
        totalPages: 0,
        filteredRows: []
    };

    const getVisibleRows = () => {
        const allRows = Array.from(tbody.querySelectorAll('tr'));
        // Filter out hidden rows (from search/filter)
        return allRows.filter(row => row.style.display !== 'none' || !row.dataset.filtered);
    };

    const updatePagination = () => {
        const allRows = Array.from(tbody.querySelectorAll('tr'));
        paginationState.filteredRows = allRows;
        paginationState.totalRows = allRows.length;
        paginationState.totalPages = Math.ceil(paginationState.totalRows / paginationState.pageSize);

        if (paginationState.currentPage > paginationState.totalPages) {
            paginationState.currentPage = Math.max(1, paginationState.totalPages);
        }

        // Hide/show rows based on current page
        const startIdx = (paginationState.currentPage - 1) * paginationState.pageSize;
        const endIdx = startIdx + paginationState.pageSize;

        allRows.forEach((row, idx) => {
            if (idx >= startIdx && idx < endIdx) {
                row.style.display = '';
                row.dataset.paginationHidden = '';
            } else {
                row.style.display = 'none';
                row.dataset.paginationHidden = '1';
            }
        });

        // Save current page
        try {
            localStorage.setItem(storageKey, String(paginationState.currentPage));
        } catch (e) {}

        renderPaginationControls();
    };

    const goToPage = (page) => {
        paginationState.currentPage = Math.max(1, Math.min(page, paginationState.totalPages));
        updatePagination();
    };

    const renderPaginationControls = () => {
        let paginationWrapper = table.parentElement.querySelector('.pagination-wrapper');

        // Only show pagination if more than one page
        if (paginationState.totalPages <= 1) {
            if (paginationWrapper) paginationWrapper.style.display = 'none';
            // Show all rows
            paginationState.filteredRows.forEach(row => {
                row.style.display = '';
                row.dataset.paginationHidden = '';
            });
            return;
        }

        if (!paginationWrapper) {
            paginationWrapper = document.createElement('div');
            paginationWrapper.className = 'pagination-wrapper';
            table.parentElement.appendChild(paginationWrapper);
        }

        paginationWrapper.style.display = '';

        const startItem = (paginationState.currentPage - 1) * paginationState.pageSize + 1;
        const endItem = Math.min(paginationState.currentPage * paginationState.pageSize, paginationState.totalRows);

        // Generate page numbers (show max 5 pages around current)
        let pageNumbers = '';
        const maxPagesToShow = 5;
        let startPage = Math.max(1, paginationState.currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(paginationState.totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        if (startPage > 1) {
            pageNumbers += `<button class="page-number" data-page="1">1</button>`;
            if (startPage > 2) pageNumbers += `<span style="color:#999;">...</span>`;
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers += `<button class="page-number ${i === paginationState.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }

        if (endPage < paginationState.totalPages) {
            if (endPage < paginationState.totalPages - 1) pageNumbers += `<span style="color:#999;">...</span>`;
            pageNumbers += `<button class="page-number" data-page="${paginationState.totalPages}">${paginationState.totalPages}</button>`;
        }

        paginationWrapper.innerHTML = `
            <div class="pagination-info">
                Showing ${startItem}-${endItem} of ${paginationState.totalRows} items
            </div>
            <div class="pagination-controls">
                <button class="prev-page" ${paginationState.currentPage === 1 ? 'disabled' : ''}>← Prev</button>
                <div class="page-numbers">${pageNumbers}</div>
                <button class="next-page" ${paginationState.currentPage === paginationState.totalPages ? 'disabled' : ''}>Next →</button>
                <div class="page-jump">
                    <span>Go to:</span>
                    <input type="number" min="1" max="${paginationState.totalPages}" value="${paginationState.currentPage}">
                </div>
            </div>
        `;

        // Attach event listeners
        paginationWrapper.querySelector('.prev-page')?.addEventListener('click', () => goToPage(paginationState.currentPage - 1));
        paginationWrapper.querySelector('.next-page')?.addEventListener('click', () => goToPage(paginationState.currentPage + 1));

        paginationWrapper.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', () => goToPage(parseInt(btn.dataset.page)));
        });

        const jumpInput = paginationWrapper.querySelector('.page-jump input');
        if (jumpInput) {
            jumpInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    goToPage(parseInt(jumpInput.value) || 1);
                }
            });
            jumpInput.addEventListener('change', () => {
                goToPage(parseInt(jumpInput.value) || 1);
            });
        }
    };

    // Initial render
    updatePagination();

    // Return API for external control
    return {
        refresh: updatePagination,
        goToPage,
        getState: () => ({ ...paginationState })
    };
}

// Store pagination instances for refresh
const paginationInstances = {};

function initTablePagination(tableId, options = {}) {
    const instance = createPagination(tableId, options);
    if (instance) {
        paginationInstances[tableId] = instance;
    }
    return instance;
}

function refreshTablePagination(tableId) {
    if (paginationInstances[tableId]) {
        paginationInstances[tableId].refresh();
    }
}

// =========================================================
// SUPER TABLE - High Performance Virtual Table with Excel Filters
// =========================================================
const superTableInstances = {};

class SuperTable {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`SuperTable: Container #${containerId} not found`);
            return;
        }

        // Default options
        this.options = {
            columns: [],           // Column definitions
            data: [],              // Data array
            rowHeight: 40,         // Height of each row in px
            pageSize: 100,         // Items per page
            storageKey: `super_table_${containerId}`,
            onRowClick: null,      // Callback when row is clicked
            onSelectionChange: null, // Callback when selection changes
            onDataChange: null,    // Callback when data changes
            renderCell: null,      // Custom cell renderer
            getRowClass: null,     // Custom row class
            ...options
        };

        // State
        this.allData = [];          // Original data
        this.filteredData = [];     // After filters applied
        this.sortedData = [];       // After sorting
        this.currentPage = 1;
        this.selectedRows = new Set();
        this.columnFilters = {};
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.columnWidths = {};
        this.columnOrder = [];
        this.isInitialized = false;

        // Load saved settings
        this.loadSettings();

        // Build the table
        this.build();
        this.isInitialized = true;
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem(this.options.storageKey);
            if (saved) {
                const settings = JSON.parse(saved);
                this.columnWidths = settings.widths || {};
                this.columnOrder = settings.order || [];
                this.currentPage = settings.page || 1;
                this.sortColumn = settings.sortCol || null;
                this.sortDirection = settings.sortDir || 'asc';
            }
        } catch (e) {}
    }

    saveSettings() {
        try {
            localStorage.setItem(this.options.storageKey, JSON.stringify({
                widths: this.columnWidths,
                order: this.columnOrder,
                page: this.currentPage,
                sortCol: this.sortColumn,
                sortDir: this.sortDirection
            }));
        } catch (e) {}
    }

    build() {
        // Clear container
        this.container.innerHTML = '';
        this.container.className = 'super-table-container';

        // Create scrollable wrapper for the table
        this.bodyContainer = document.createElement('div');
        this.bodyContainer.className = 'super-table-body-container';

        // Create table
        this.table = document.createElement('table');
        this.table.className = 'super-table';
        this.table.id = `${this.containerId}-table`;

        // Create thead
        this.thead = document.createElement('thead');
        this.buildHeader();
        this.table.appendChild(this.thead);

        // Create actual tbody - keep it inside the table
        this.tbody = document.createElement('tbody');
        this.table.appendChild(this.tbody);

        // Add table to body container
        this.bodyContainer.appendChild(this.table);
        this.container.appendChild(this.bodyContainer);

        // Create status bar
        this.statusBar = document.createElement('div');
        this.statusBar.className = 'super-table-status-bar';
        this.container.appendChild(this.statusBar);

        // Setup scroll handler for potential virtual scrolling
        this.setupVirtualScroll();

        // Setup resize handlers
        this.setupResizeHandlers();

        // Setup drag handlers
        this.setupDragHandlers();
    }

    buildHeader() {
        this.thead.innerHTML = '';
        const tr = document.createElement('tr');

        // Get ordered columns
        const orderedCols = this.getOrderedColumns();

        orderedCols.forEach((col, idx) => {
            const th = document.createElement('th');
            th.dataset.colId = col.id;

            // Apply column classes
            if (col.type === 'checkbox') th.className = 'col-checkbox';
            else if (col.type === 'action') th.className = 'col-action';

            // Apply saved width
            if (this.columnWidths[col.id]) {
                th.style.width = this.columnWidths[col.id] + 'px';
            } else if (col.width) {
                th.style.width = typeof col.width === 'number' ? col.width + 'px' : col.width;
            }

            // Build header content
            const headerWrap = document.createElement('div');
            headerWrap.className = 'col-header-wrap';

            // Title row
            const titleRow = document.createElement('div');
            titleRow.className = 'col-title-row';

            if (col.type === 'checkbox') {
                // Checkbox column - select all
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'select-all-checkbox';
                checkbox.addEventListener('change', () => this.toggleSelectAll(checkbox.checked));
                titleRow.appendChild(checkbox);
            } else {
                // Drag handle
                if (col.type !== 'action') {
                    const dragHandle = document.createElement('span');
                    dragHandle.className = 'col-drag-handle';
                    dragHandle.textContent = '⋮⋮';
                    titleRow.appendChild(dragHandle);
                }

                // Title text
                const titleText = document.createElement('span');
                titleText.className = 'col-title-text';
                titleText.textContent = col.title || col.id;
                titleRow.appendChild(titleText);

                // Sort icon (if sortable)
                if (col.sortable !== false && col.type !== 'action') {
                    const sortIcon = document.createElement('span');
                    sortIcon.className = 'col-sort-icon';
                    if (this.sortColumn === col.id) {
                        sortIcon.className += ' active';
                        sortIcon.textContent = this.sortDirection === 'asc' ? '▲' : '▼';
                    } else {
                        sortIcon.textContent = '↕';
                    }
                    titleRow.appendChild(sortIcon);

                    // Sort on click
                    titleRow.addEventListener('click', (e) => {
                        if (!e.target.closest('.col-drag-handle')) {
                            this.handleSort(col.id);
                        }
                    });
                }
            }

            headerWrap.appendChild(titleRow);

            // Filter row (for filterable columns)
            if (col.filterable !== false && col.type !== 'checkbox' && col.type !== 'action') {
                const filterRow = document.createElement('div');
                filterRow.className = 'col-filter-row';

                const filterInput = document.createElement('input');
                filterInput.type = 'text';
                filterInput.className = 'col-filter-input';
                filterInput.placeholder = 'Filter...';
                filterInput.dataset.colId = col.id;
                filterInput.value = this.columnFilters[col.id] || '';

                // Debounced filter
                let filterTimeout;
                filterInput.addEventListener('input', () => {
                    clearTimeout(filterTimeout);
                    filterTimeout = setTimeout(() => {
                        this.columnFilters[col.id] = filterInput.value;
                        this.applyFiltersAndSort();
                    }, 200);
                });

                filterInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        filterInput.value = '';
                        this.columnFilters[col.id] = '';
                        this.applyFiltersAndSort();
                    }
                });

                filterRow.appendChild(filterInput);
                headerWrap.appendChild(filterRow);
            }

            th.appendChild(headerWrap);

            // Resize handle
            if (col.resizable !== false && col.type !== 'checkbox') {
                const resizeHandle = document.createElement('div');
                resizeHandle.className = 'col-resize-handle';
                th.appendChild(resizeHandle);
            }

            tr.appendChild(th);
        });

        this.thead.appendChild(tr);
    }

    getOrderedColumns() {
        const cols = [...this.options.columns];
        if (this.columnOrder.length > 0) {
            // Sort by saved order
            cols.sort((a, b) => {
                const aIdx = this.columnOrder.indexOf(a.id);
                const bIdx = this.columnOrder.indexOf(b.id);
                if (aIdx === -1 && bIdx === -1) return 0;
                if (aIdx === -1) return 1;
                if (bIdx === -1) return -1;
                return aIdx - bIdx;
            });
        }
        return cols;
    }

    setupVirtualScroll() {
        this.bodyContainer.addEventListener('scroll', () => {
            this.renderVisibleRows();
        });
    }

    setupResizeHandlers() {
        let resizing = null;
        let startX = 0;
        let startWidth = 0;

        const onMouseMove = (e) => {
            if (!resizing) return;
            const diff = e.clientX - startX;
            const newWidth = Math.max(50, startWidth + diff);
            resizing.th.style.width = newWidth + 'px';
        };

        const onMouseUp = () => {
            if (resizing) {
                const colId = resizing.th.dataset.colId;
                this.columnWidths[colId] = resizing.th.offsetWidth;
                this.saveSettings();
                resizing.handle.classList.remove('resizing');
                this.table.classList.remove('resizing');
            }
            resizing = null;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        this.thead.addEventListener('mousedown', (e) => {
            const handle = e.target.closest('.col-resize-handle');
            if (!handle) return;

            e.preventDefault();
            const th = handle.parentElement;
            resizing = { th, handle };
            startX = e.clientX;
            startWidth = th.offsetWidth;
            handle.classList.add('resizing');
            this.table.classList.add('resizing');

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    setupDragHandlers() {
        let draggedTh = null;

        this.thead.addEventListener('dragstart', (e) => {
            const th = e.target.closest('th');
            if (!th || th.classList.contains('col-checkbox') || th.classList.contains('col-action')) return;

            draggedTh = th;
            th.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', th.dataset.colId);
        });

        this.thead.addEventListener('dragend', (e) => {
            if (draggedTh) {
                draggedTh.classList.remove('dragging');
                draggedTh = null;
            }
            this.thead.querySelectorAll('th').forEach(th => th.classList.remove('drag-over'));
        });

        this.thead.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            const th = e.target.closest('th');
            if (th && th !== draggedTh && !th.classList.contains('col-checkbox') && !th.classList.contains('col-action')) {
                th.classList.add('drag-over');
            }
        });

        this.thead.addEventListener('dragleave', (e) => {
            const th = e.target.closest('th');
            if (th) th.classList.remove('drag-over');
        });

        this.thead.addEventListener('drop', (e) => {
            e.preventDefault();
            const targetTh = e.target.closest('th');
            if (!targetTh || targetTh === draggedTh || !draggedTh) return;
            if (targetTh.classList.contains('col-checkbox') || targetTh.classList.contains('col-action')) return;

            targetTh.classList.remove('drag-over');

            const draggedId = draggedTh.dataset.colId;
            const targetId = targetTh.dataset.colId;

            // Update column order
            const cols = this.getOrderedColumns().map(c => c.id);
            const draggedIdx = cols.indexOf(draggedId);
            const targetIdx = cols.indexOf(targetId);

            cols.splice(draggedIdx, 1);
            cols.splice(targetIdx, 0, draggedId);

            this.columnOrder = cols;
            this.saveSettings();

            // Rebuild header and re-render
            this.buildHeader();
            this.setupResizeHandlers();
            this.setupDragHandlers();
            this.renderVisibleRows();

            // Make headers draggable
            this.thead.querySelectorAll('th').forEach(th => {
                if (!th.classList.contains('col-checkbox') && !th.classList.contains('col-action')) {
                    th.draggable = true;
                }
            });
        });

        // Make headers draggable
        this.thead.querySelectorAll('th').forEach(th => {
            if (!th.classList.contains('col-checkbox') && !th.classList.contains('col-action')) {
                th.draggable = true;
            }
        });
    }

    setData(data) {
        this.allData = data || [];
        this.selectedRows.clear();
        this.applyFiltersAndSort();
    }

    applyFiltersAndSort() {
        // Apply filters
        this.filteredData = this.allData.filter(item => {
            for (const colId in this.columnFilters) {
                const filterVal = String(this.columnFilters[colId] || '').toLowerCase().trim();
                if (!filterVal) continue;

                const col = this.options.columns.find(c => c.id === colId);
                if (!col) continue;

                let cellVal = '';
                if (col.getValue) {
                    cellVal = String(col.getValue(item) || '').toLowerCase();
                } else {
                    cellVal = String(item[colId] || '').toLowerCase();
                }

                if (!cellVal.includes(filterVal)) {
                    return false;
                }
            }
            return true;
        });

        // Apply sorting
        if (this.sortColumn) {
            const col = this.options.columns.find(c => c.id === this.sortColumn);
            this.filteredData.sort((a, b) => {
                let aVal, bVal;
                if (col && col.getValue) {
                    aVal = col.getValue(a);
                    bVal = col.getValue(b);
                } else {
                    aVal = a[this.sortColumn];
                    bVal = b[this.sortColumn];
                }

                // Handle numeric values
                if (col && col.type === 'number') {
                    aVal = parseFloat(aVal) || 0;
                    bVal = parseFloat(bVal) || 0;
                } else {
                    aVal = String(aVal || '').toLowerCase();
                    bVal = String(bVal || '').toLowerCase();
                }

                let cmp = 0;
                if (aVal < bVal) cmp = -1;
                else if (aVal > bVal) cmp = 1;

                return this.sortDirection === 'asc' ? cmp : -cmp;
            });
        }

        this.sortedData = this.filteredData;

        // Reset to page 1 if current page is out of range
        const totalPages = Math.ceil(this.sortedData.length / this.options.pageSize);
        if (this.currentPage > totalPages) {
            this.currentPage = Math.max(1, totalPages);
        }

        this.renderVisibleRows();
        this.renderStatusBar();
    }

    handleSort(colId) {
        if (this.sortColumn === colId) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = colId;
            this.sortDirection = 'asc';
        }
        this.saveSettings();
        this.buildHeader();
        this.setupResizeHandlers();
        this.setupDragHandlers();
        this.applyFiltersAndSort();
    }

    renderVisibleRows() {
        const pageSize = this.options.pageSize;
        const startIdx = (this.currentPage - 1) * pageSize;
        const endIdx = Math.min(startIdx + pageSize, this.sortedData.length);
        const pageData = this.sortedData.slice(startIdx, endIdx);

        this.tbody.innerHTML = '';

        if (pageData.length === 0) {
            // Show no results
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = this.options.columns.length;
            td.className = 'super-table-no-results';
            td.innerHTML = `
                <div class="super-table-no-results-icon">📭</div>
                <div>No items match your filters</div>
            `;
            tr.appendChild(td);
            this.tbody.appendChild(tr);
            return;
        }

        const orderedCols = this.getOrderedColumns();

        pageData.forEach((item, pageIdx) => {
            const dataIdx = startIdx + pageIdx;
            const originalIdx = this.allData.indexOf(item);
            const tr = document.createElement('tr');
            tr.dataset.index = originalIdx;
            tr.dataset.dataIndex = dataIdx;

            // Apply row class
            if (this.options.getRowClass) {
                const cls = this.options.getRowClass(item, originalIdx);
                if (cls) tr.className = cls;
            }

            // Selection
            if (this.selectedRows.has(originalIdx)) {
                tr.classList.add('selected');
            }

            orderedCols.forEach(col => {
                const td = document.createElement('td');

                if (col.type === 'checkbox') {
                    td.className = 'col-checkbox';
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'row-checkbox';
                    checkbox.checked = this.selectedRows.has(originalIdx);
                    checkbox.addEventListener('click', (e) => e.stopPropagation());
                    checkbox.addEventListener('change', () => {
                        this.toggleRowSelection(originalIdx, checkbox.checked);
                    });
                    td.appendChild(checkbox);
                } else if (col.type === 'action') {
                    td.className = 'col-action';
                    td.textContent = '👁️';
                    td.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (this.options.onRowClick) {
                            this.options.onRowClick(item, originalIdx);
                        }
                    });
                } else if (this.options.renderCell) {
                    // Custom renderer
                    const content = this.options.renderCell(col, item, originalIdx);
                    if (typeof content === 'string') {
                        td.innerHTML = content;
                    } else if (content instanceof HTMLElement) {
                        td.appendChild(content);
                    }
                } else if (col.render) {
                    // Column-specific renderer
                    const content = col.render(item, originalIdx);
                    if (typeof content === 'string') {
                        td.innerHTML = content;
                    } else if (content instanceof HTMLElement) {
                        td.appendChild(content);
                    }
                } else {
                    // Default: get value
                    let value = col.getValue ? col.getValue(item) : item[col.id];
                    td.textContent = value ?? '';
                }

                tr.appendChild(td);
            });

            // Row click handler - add cursor style for clickable rows
            tr.style.cursor = 'pointer';
            tr.addEventListener('click', (e) => {
                // Don't trigger row click if clicking on checkbox, action column, select, or input
                if (e.target.closest('.row-checkbox') ||
                    e.target.closest('.col-action') ||
                    e.target.closest('select') ||
                    e.target.closest('input')) {
                    return;
                }
                if (this.options.onRowClick) {
                    this.options.onRowClick(item, originalIdx);
                }
            });

            this.tbody.appendChild(tr);
        });

        // Update select-all checkbox
        this.updateSelectAllCheckbox();
    }

    renderStatusBar() {
        const total = this.allData.length;
        const filtered = this.sortedData.length;
        const pageSize = this.options.pageSize;
        const totalPages = Math.ceil(filtered / pageSize);
        const startItem = filtered > 0 ? (this.currentPage - 1) * pageSize + 1 : 0;
        const endItem = Math.min(this.currentPage * pageSize, filtered);

        const hasFilters = Object.values(this.columnFilters).some(v => v);

        // Generate page numbers
        let pageNumbers = '';
        const maxPagesToShow = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        if (startPage > 1) {
            pageNumbers += `<button class="page-number" data-page="1">1</button>`;
            if (startPage > 2) pageNumbers += `<span style="color:#999;">...</span>`;
        }
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers += `<button class="page-number ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pageNumbers += `<span style="color:#999;">...</span>`;
            pageNumbers += `<button class="page-number" data-page="${totalPages}">${totalPages}</button>`;
        }

        this.statusBar.innerHTML = `
            <div class="super-table-status-left">
                <span><b>${this.selectedRows.size}</b> selected</span>
                <span>${filtered !== total ? `Showing ${filtered} of ${total} items (filtered)` : `${total} items`}</span>
                ${hasFilters ? `<button class="super-table-clear-filters">Clear Filters</button>` : ''}
            </div>
            <div class="super-table-status-right">
                <span>Rows: ${startItem}-${endItem}</span>
                <select class="super-table-page-size-select">
                    <option value="50" ${pageSize === 50 ? 'selected' : ''}>50 / page</option>
                    <option value="100" ${pageSize === 100 ? 'selected' : ''}>100 / page</option>
                    <option value="200" ${pageSize === 200 ? 'selected' : ''}>200 / page</option>
                    <option value="500" ${pageSize === 500 ? 'selected' : ''}>500 / page</option>
                </select>
                <div class="super-table-page-nav">
                    <button class="prev-page" ${this.currentPage <= 1 ? 'disabled' : ''}>← Prev</button>
                    ${pageNumbers}
                    <button class="next-page" ${this.currentPage >= totalPages ? 'disabled' : ''}>Next →</button>
                </div>
                <div class="super-table-jump">
                    <span>Go to:</span>
                    <input type="number" min="1" max="${totalPages}" value="${this.currentPage}">
                </div>
            </div>
        `;

        // Attach handlers
        this.statusBar.querySelector('.prev-page')?.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        this.statusBar.querySelector('.next-page')?.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        this.statusBar.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', () => this.goToPage(parseInt(btn.dataset.page)));
        });

        const jumpInput = this.statusBar.querySelector('.super-table-jump input');
        if (jumpInput) {
            jumpInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.goToPage(parseInt(jumpInput.value) || 1);
            });
            jumpInput.addEventListener('change', () => {
                this.goToPage(parseInt(jumpInput.value) || 1);
            });
        }

        const pageSizeSelect = this.statusBar.querySelector('.super-table-page-size-select');
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', () => {
                this.options.pageSize = parseInt(pageSizeSelect.value);
                this.currentPage = 1;
                this.applyFiltersAndSort();
            });
        }

        const clearBtn = this.statusBar.querySelector('.super-table-clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearFilters());
        }
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.sortedData.length / this.options.pageSize);
        this.currentPage = Math.max(1, Math.min(page, totalPages));
        this.saveSettings();
        this.renderVisibleRows();
        this.renderStatusBar();
    }

    clearFilters() {
        this.columnFilters = {};
        this.thead.querySelectorAll('.col-filter-input').forEach(input => {
            input.value = '';
        });
        this.applyFiltersAndSort();
    }

    toggleSelectAll(checked) {
        const pageSize = this.options.pageSize;
        const startIdx = (this.currentPage - 1) * pageSize;
        const endIdx = Math.min(startIdx + pageSize, this.sortedData.length);

        for (let i = startIdx; i < endIdx; i++) {
            const item = this.sortedData[i];
            const originalIdx = this.allData.indexOf(item);
            if (checked) {
                this.selectedRows.add(originalIdx);
            } else {
                this.selectedRows.delete(originalIdx);
            }
        }

        this.renderVisibleRows();
        this.renderStatusBar();
        if (this.options.onSelectionChange) {
            this.options.onSelectionChange(this.getSelectedItems());
        }
    }

    toggleRowSelection(idx, checked) {
        if (checked) {
            this.selectedRows.add(idx);
        } else {
            this.selectedRows.delete(idx);
        }
        this.updateSelectAllCheckbox();
        this.renderStatusBar();
        if (this.options.onSelectionChange) {
            this.options.onSelectionChange(this.getSelectedItems());
        }
    }

    updateSelectAllCheckbox() {
        const selectAll = this.thead.querySelector('.select-all-checkbox');
        if (!selectAll) return;

        const pageSize = this.options.pageSize;
        const startIdx = (this.currentPage - 1) * pageSize;
        const endIdx = Math.min(startIdx + pageSize, this.sortedData.length);

        let allSelected = true;
        let anySelected = false;

        for (let i = startIdx; i < endIdx; i++) {
            const item = this.sortedData[i];
            const originalIdx = this.allData.indexOf(item);
            if (this.selectedRows.has(originalIdx)) {
                anySelected = true;
            } else {
                allSelected = false;
            }
        }

        selectAll.checked = allSelected && anySelected;
        selectAll.indeterminate = anySelected && !allSelected;
    }

    getSelectedItems() {
        return Array.from(this.selectedRows).map(idx => this.allData[idx]).filter(Boolean);
    }

    getSelectedIndices() {
        return Array.from(this.selectedRows);
    }

    clearSelection() {
        this.selectedRows.clear();
        this.renderVisibleRows();
        this.renderStatusBar();
    }

    refresh() {
        this.applyFiltersAndSort();
    }

    destroy() {
        this.container.innerHTML = '';
        delete superTableInstances[this.containerId];
    }
}

// Factory function
function createSuperTable(containerId, options) {
    if (superTableInstances[containerId]) {
        superTableInstances[containerId].destroy();
    }
    const instance = new SuperTable(containerId, options);
    superTableInstances[containerId] = instance;
    return instance;
}

function getSuperTable(containerId) {
    return superTableInstances[containerId];
}

function filterMainProjects() {
    const filterInput = getEl('main-filter');
    const statusFilter = getEl('main-status-filter');
    const tb = getEl('main-projects-tbody');
    if (!tb) return;

    const search = String(filterInput?.value || '').toLowerCase().trim();
    const status = String(statusFilter?.value || '').toLowerCase();

    const rows = tb.querySelectorAll('tr');
    rows.forEach(row => {
        const name = row.querySelector('td:first-child')?.textContent?.toLowerCase() || '';
        const rowStatus = row.querySelector('td:nth-child(2)')?.textContent?.toLowerCase() || '';

        let show = true;
        if (search && !name.includes(search)) show = false;
        if (status && !rowStatus.includes(status)) show = false;

        row.style.display = show ? '' : 'none';
    });
}

function exportMainProjectsCSV() {
    projects = getAllProjectsSafe();
    const list = Array.isArray(projects) ? projects : [];
    const headers = ['Project ID','Project Name','Items','Suppliers','Bundles','Deadline','Sent To','Dashboard Notes'];
    const rows = list.map(p => {
        const items = Array.isArray(p.items) ? p.items.length : 0;
        const suppliers = getProjectSuppliersCountSafe(p);
        const bundles = getProjectBundlesSafe(p).length;
        const deadline = p && p.dates ? (p.dates.deadline || '') : '';
        const sentTo = p && p.dates ? (p.dates.sent_to || p.dates.sentTo || '') : '';
        const notes = Array.isArray(p.dashboard_notes) ? p.dashboard_notes.map(n => (n && n.text) ? String(n.text).replace(/\s+/g,' ').trim() : '').filter(Boolean).join(' | ') : '';
        return [p.id, p.name, items, suppliers, bundles, deadline, sentTo, notes];
    });
    const csv = [headers, ...rows].map(r => r.map(v => {
        const s = String(v ?? '');
        if (s.includes('"') || s.includes(',') || s.includes('\n')) return '"' + s.replace(/"/g, '""') + '"';
        return s;
    }).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RFQ_MAIN_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// =========================================================
// Global Supplier Detail (from Main view)
// =========================================================
function openGlobalSupplierDetail(supplierName) {
    if (!supplierName) return;

    projects = getAllProjectsSafe();
    const allProjects = Array.isArray(projects) ? projects : [];

    // Find a project that has this supplier
    let targetProject = null;
    for (const p of allProjects) {
        const items = Array.isArray(p.items) ? p.items : [];
        for (const it of items) {
            if (it.supplier === supplierName || it.main_supplier === supplierName) {
                targetProject = p;
                break;
            }
            const supArr = Array.isArray(it.suppliers) ? it.suppliers : [];
            for (const s of supArr) {
                const nm = s && (s.supplier || s.name || s.company);
                if (nm === supplierName) {
                    targetProject = p;
                    break;
                }
            }
            if (targetProject) break;
        }
        if (targetProject) break;

        // Also check bundles
        const bundles = getProjectBundlesSafe(p);
        for (const b of bundles) {
            const sup = String((b && (b.supplier || b.supplier_name || b.supplierName)) || '').trim();
            if (sup === supplierName) {
                targetProject = p;
                break;
            }
        }
        if (targetProject) break;
    }

    if (targetProject) {
        // Open the project and then the supplier detail
        if (typeof openProject === 'function') {
            openProject(targetProject);
        }
        if (window.openSupplierDetail && typeof window.openSupplierDetail === 'function') {
            window.openSupplierDetail(supplierName);
        }
    } else {
        alert('Supplier "' + supplierName + '" not found in any project.');
    }
}

// =========================================================
// Dashboard Notes / Comments (project-level)
// =========================================================

function renderDashboardNotes() {
    const tb = getEl('dash-notes-tbody');
    if (!tb) return;
    if (!currentProject) { tb.innerHTML = '<tr><td colspan="3" class="muted" style="padding:12px;">Select a project to see comments.</td></tr>'; return; }
    const notes = Array.isArray(currentProject.dashboard_notes) ? currentProject.dashboard_notes : [];
    if (!notes.length) { tb.innerHTML = '<tr><td colspan="3" class="muted" style="padding:12px;">No comments yet.</td></tr>'; return; }
    tb.innerHTML = notes.map(n => {
        const dt = n && n.created_at ? String(n.created_at).slice(0,19).replace('T',' ') : '';
        const txt = n && n.text ? String(n.text) : '';
        const id = n && n.id ? String(n.id) : '';
        return `
            <tr>
                <td>${escapeHtml(dt)}</td>
                <td>${escapeHtml(txt)}</td>
                <td style="white-space:nowrap;">
                    <button class="btn-secondary btn-sm" data-dash-note-action="edit" data-id="${escapeHtml(id)}">Edit</button>
                    <button class="btn-secondary btn-sm" data-dash-note-action="delete" data-id="${escapeHtml(id)}">Del</button>
                </td>
            </tr>
        `;
    }).join('');
}

// =========================================================
// Project Detail (per project)
// - links, notes, comments, attachments, cover photo
// =========================================================

const __PROJ_DETAIL_CACHE__ = window.__PROJ_DETAIL_CACHE__ || { attachments: new Map() };
window.__PROJ_DETAIL_CACHE__ = __PROJ_DETAIL_CACHE__;

function ensureProjectDetailFields(proj) {
    if (!proj || typeof proj !== 'object') return;
    if (!Array.isArray(proj.project_links)) proj.project_links = [];
    if (!Array.isArray(proj.project_comments)) proj.project_comments = [];
    if (proj.project_notes_text === undefined || proj.project_notes_text === null) proj.project_notes_text = '';
    if (proj.cover_attachment_id === undefined || proj.cover_attachment_id === null) proj.cover_attachment_id = '';
}

function projDetailApiUrl(pid) {
    return `/api/projects/${encodeURIComponent(String(pid))}/attachments`;
}
function projDetailApiUrlOne(pid, aid) {
    return `/api/projects/${encodeURIComponent(String(pid))}/attachments/${encodeURIComponent(String(aid))}`;
}

async function projDetailFetchJson(url, opts) {
    const o = opts || {};
    const res = await fetch(url, { method: o.method || 'GET', body: o.body, credentials: 'same-origin' });
    if (!res.ok) {
        const t = await res.text().catch(()=>'');
        throw new Error(t || ('HTTP ' + res.status));
    }
    return await res.json();
}

async function loadProjectAttachments(pid) {
    if (!pid) return [];
    try {
        const data = await projDetailFetchJson(projDetailApiUrl(pid));
        const arr = data && Array.isArray(data.attachments) ? data.attachments : [];
        __PROJ_DETAIL_CACHE__.attachments.set(String(pid), arr);
        return arr;
    } catch (e) {
        __PROJ_DETAIL_CACHE__.attachments.set(String(pid), []);
        return [];
    }
}

async function uploadProjectAttachment(pid, file, kind) {
    if (!pid || !file) return null;
    const fd = new FormData();
    fd.append('file', file);
    if (kind) fd.append('kind', String(kind));
    const data = await projDetailFetchJson(projDetailApiUrl(pid), { method: 'POST', body: fd });
    return data && data.attachment ? data.attachment : null;
}

async function deleteProjectAttachment(pid, aid) {
    if (!pid || !aid) return false;
    await projDetailFetchJson(projDetailApiUrlOne(pid, aid), { method: 'DELETE' });
    return true;
}

function openAddProjectLinkModal(onAdd) {
    const id = 'proj-link-editor-modal';
    let overlay = document.getElementById(id);
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = id;
        overlay.className = 'modal-overlay';
        overlay.style.zIndex = '3700';
        overlay.innerHTML = `
            <div class="modal-content" style="max-width: 620px; width: 92vw;">
                <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
                    <h3 style="margin:0;">Add Project Link</h3>
                    <button class="btn-secondary" id="btn-proj-link-close" type="button">Close</button>
                </div>
                <div class="form-row" style="margin-top:12px;">
                    <label>Title</label>
                    <input id="proj-link-title" class="modal-input" type="text" placeholder="e.g. Customer portal, SharePoint, Drawing folder">
                </div>
                <div class="form-row">
                    <label>URL</label>
                    <input id="proj-link-url" class="modal-input" type="url" placeholder="https://...">
                </div>
                <div class="modal-actions">
                    <button class="btn-secondary" id="btn-proj-link-cancel" type="button">Cancel</button>
                    <button class="btn-primary" id="btn-proj-link-add" type="button">Add</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    const close = () => { overlay.classList.add('hidden'); overlay.setAttribute('aria-hidden','true'); };
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden','false');

    const t = document.getElementById('proj-link-title');
    const u = document.getElementById('proj-link-url');
    if (t) t.value = '';
    if (u) u.value = '';

    const btnClose = document.getElementById('btn-proj-link-close');
    const btnCancel = document.getElementById('btn-proj-link-cancel');
    const btnAdd = document.getElementById('btn-proj-link-add');

    if (btnClose) btnClose.onclick = close;
    if (btnCancel) btnCancel.onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };

    if (btnAdd) btnAdd.onclick = () => {
        const title = t ? String(t.value || '').trim() : '';
        const url = u ? String(u.value || '').trim() : '';
        if (!url) { alert('URL is required'); return; }
        try { new URL(url); } catch (e) { alert('Invalid URL'); return; }
        try { if (typeof onAdd === 'function') onAdd({ title, url }); } catch (e) {}
        close();
    };
}

let __projdetail_notes_timer = null;

function renderProjectDetail() {
    const titleEl = getEl('projdetail-title');
    const idEl = getEl('projdetail-id');
    const selStatus = getEl('projdetail-status');
    const receivedEl = getEl('projdetail-received');
    const bomEl = getEl('projdetail-bom');
    const deadlineEl = getEl('projdetail-deadline');
    const sentEl = getEl('projdetail-sent');
    const sentToEl = getEl('projdetail-sentto');

    const linksTbody = getEl('projdetail-links-tbody');
    const attachBox = getEl('projdetail-attachments');

    const coverImg = getEl('projdetail-cover-img');
    const coverEmpty = getEl('projdetail-cover-empty');

    const notesTa = getEl('projdetail-notes');
    const commentTa = getEl('projdetail-comment-text');
    const commentsBox = getEl('projdetail-comments');

    const btnBack = getEl('btn-projdetail-back');
    const btnEdit = getEl('btn-projdetail-edit');
    const btnAddLink = getEl('btn-projdetail-add-link');
    const btnUpload = getEl('btn-projdetail-upload');
    const btnUploadCover = getEl('btn-projdetail-upload-cover');
    const fileInput = getEl('projdetail-file');
    const coverInput = getEl('projdetail-cover-file');
    const btnAddComment = getEl('btn-projdetail-comment-add');

    if (btnBack && !btnBack.dataset.bound) {
        btnBack.dataset.bound = '1';
        btnBack.onclick = () => { try { switchView('dashboard'); } catch (e) {} };
    }
    if (btnEdit && !btnEdit.dataset.bound) {
        btnEdit.dataset.bound = '1';
        btnEdit.onclick = () => { try { openEditProjectModal(); } catch (e) {} };
    }

    if (!currentProject) {
        if (titleEl) titleEl.textContent = '—';
        if (idEl) idEl.textContent = '—';
        if (selStatus) { fillProjectStatusSelect(selStatus, 'Created'); selStatus.disabled = true; }
        if (linksTbody) linksTbody.innerHTML = '<tr><td colspan="3" class="muted" style="padding:12px;">Select a project.</td></tr>';
        if (attachBox) attachBox.textContent = 'Select a project.';
        if (notesTa) notesTa.value = '';
        if (commentsBox) commentsBox.innerHTML = '<div class="muted" style="padding:12px;">Select a project.</div>';
        return;
    }

    ensureProjectDetailFields(currentProject);

    if (titleEl) titleEl.textContent = currentProject.name || 'Untitled';
    if (idEl) idEl.textContent = String(currentProject.id || '');

    // Tab switching for Project Detail
    const projDetailRoot = getEl('view-project-detail');
    if (projDetailRoot && !projDetailRoot.dataset.tabsBound) {
        projDetailRoot.dataset.tabsBound = '1';
        projDetailRoot.querySelectorAll('.sd-tab').forEach(tab => {
            tab.onclick = () => {
                projDetailRoot.querySelectorAll('.sd-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                projDetailRoot.querySelectorAll('.sd-panel').forEach(p => p.classList.remove('active'));
                const panel = projDetailRoot.querySelector(`.sd-panel[data-panel="${tab.dataset.tab}"]`);
                if (panel) panel.classList.add('active');
            };
        });
    }

    // Calculate KPIs
    const items = Array.isArray(currentProject.items) ? currentProject.items : [];
    const supplierSet = new Set();
    let totalValue = 0;
    items.forEach(it => {
        if (it.supplier) supplierSet.add(it.supplier);
        const p1 = parseFloat(it.price_1_euro || it.price_1 || 0) || 0;
        const q1 = parseFloat(it.qty_1 || 1) || 1;
        totalValue += p1 * q1;
    });

    const elKpiItems = getEl('projdetail-kpi-items');
    const elKpiSuppliers = getEl('projdetail-kpi-suppliers');
    const elKpiValue = getEl('projdetail-kpi-value');
    if (elKpiItems) elKpiItems.textContent = items.length;
    if (elKpiSuppliers) elKpiSuppliers.textContent = supplierSet.size;
    if (elKpiValue) elKpiValue.textContent = '€' + totalValue.toLocaleString('en-US', {minimumFractionDigits:0, maximumFractionDigits:0});

    // Overview dates
    const d = currentProject.dates || {};
    if (receivedEl) receivedEl.textContent = d.received || '—';
    if (bomEl) bomEl.textContent = d.bom_received || '—';
    if (sentEl) sentEl.textContent = d.sent || '—';
    if (sentToEl) sentToEl.textContent = d.sent_to || '—';

    // Deadline with highlighting
    const deadlineRow = getEl('projdetail-deadline-row');
    if (deadlineEl) {
        const dl = d.deadline || '';
        if (dl) {
            const dlDate = new Date(dl);
            const today = new Date();
            const daysLeft = Math.ceil((dlDate - today) / (1000 * 60 * 60 * 24));
            let color = '#333';
            if (daysLeft < 0) color = '#dc3545';
            else if (daysLeft <= 7) color = '#fd7e14';
            else if (daysLeft <= 14) color = '#ffc107';
            deadlineEl.innerHTML = `<span style="color:${color}; font-weight:600;">${dl}</span>`;
            if (daysLeft <= 7 && daysLeft >= 0) deadlineEl.innerHTML += ` <span style="color:${color}; font-size:11px;">(${daysLeft}d)</span>`;
            else if (daysLeft < 0) deadlineEl.innerHTML += ` <span style="color:${color}; font-size:11px;">(overdue)</span>`;
        } else {
            deadlineEl.textContent = '—';
        }
    }

    // Status
    if (selStatus) {
        selStatus.disabled = false;
        fillProjectStatusSelect(selStatus, getCurrentProjectStatus());
        if (!selStatus.dataset.bound) {
            selStatus.dataset.bound = '1';
            selStatus.onchange = () => setCurrentProjectStatus(selStatus.value);
        }
    }

    // Links
    if (btnAddLink && !btnAddLink.dataset.bound) {
        btnAddLink.dataset.bound = '1';
        btnAddLink.onclick = () => {
            openAddProjectLinkModal(({ title, url }) => {
                const rec = { id: uid(), title: title || '', url, created_at: new Date().toISOString() };
                currentProject.project_links.push(rec);
                updateProject(currentProject);
                renderProjectDetail();
            });
        };
    }
    if (linksTbody) {
        const links = Array.isArray(currentProject.project_links) ? currentProject.project_links : [];
        if (!links.length) {
            linksTbody.innerHTML = '<tr><td colspan="3" class="muted" style="padding:12px;">No links yet.</td></tr>';
        } else {
            linksTbody.innerHTML = links.map(l => {
                const lid = String(l && l.id ? l.id : '');
                const title = String(l && l.title ? l.title : '');
                const url = String(l && l.url ? l.url : '');
                return `
                    <tr>
                        <td>${escapeHtml(title)}</td>
                        <td><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a></td>
                        <td style="white-space:nowrap;">
                            <button class="btn-secondary btn-sm" data-projdetail-action="del-link" data-id="${escapeHtml(lid)}">Del</button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }

    // Attachments actions
    if (btnUpload && fileInput && !btnUpload.dataset.bound) {
        btnUpload.dataset.bound = '1';
        btnUpload.onclick = () => { try { fileInput.click(); } catch (e) {} };
    }
    if (btnUploadCover && coverInput && !btnUploadCover.dataset.bound) {
        btnUploadCover.dataset.bound = '1';
        btnUploadCover.onclick = () => { try { coverInput.click(); } catch (e) {} };
    }
    if (fileInput && !fileInput.dataset.bound) {
        fileInput.dataset.bound = '1';
        fileInput.addEventListener('change', async (e) => {
            const f = e.target.files && e.target.files[0];
            if (!f) return;
            try {
                await uploadProjectAttachment(String(currentProject.id), f, 'file');
                await loadProjectAttachments(String(currentProject.id));
                renderProjectDetail();
            } catch (err) {
                alert('Upload failed: ' + (err && err.message ? err.message : String(err)));
            } finally {
                e.target.value = '';
            }
        });
    }
    if (coverInput && !coverInput.dataset.bound) {
        coverInput.dataset.bound = '1';
        coverInput.addEventListener('change', async (e) => {
            const f = e.target.files && e.target.files[0];
            if (!f) return;
            try {
                const att = await uploadProjectAttachment(String(currentProject.id), f, 'cover');
                if (att && att.id) {
                    currentProject.cover_attachment_id = String(att.id);
                    updateProject(currentProject);
                }
                await loadProjectAttachments(String(currentProject.id));
                renderProjectDetail();
            } catch (err) {
                alert('Upload failed: ' + (err && err.message ? err.message : String(err)));
            } finally {
                e.target.value = '';
            }
        });
    }

    // Render attachments list (from cache; refresh async if missing)
    const pid = String(currentProject.id || '');
    let atts = __PROJ_DETAIL_CACHE__.attachments.get(pid);
    if (!Array.isArray(atts)) {
        atts = [];
        loadProjectAttachments(pid).then(() => { try { renderProjectDetail(); } catch (e) {} });
    }

    if (attachBox) {
        if (!atts.length) {
            attachBox.innerHTML = '<div class="muted">No files yet.</div>';
        } else {
            attachBox.innerHTML = atts.map(a => {
                const aid = String(a && a.id ? a.id : '');
                const name = String(a && a.filename ? a.filename : (a && a.name ? a.name : 'file'));
                const url = String(a && a.url ? a.url : '');
                const size = a && a.size ? String(a.size) : '';
                const dt = a && a.uploaded_at ? String(a.uploaded_at).slice(0,19).replace('T',' ') : '';
                return `
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:6px 0; border-bottom:1px solid #f1f1f1;">
                        <div style="min-width:0;">
                            <div style="font-weight:600; font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(name)}</div>
                            <div class="muted" style="font-size:11px;">${escapeHtml(dt)} ${size ? '• ' + escapeHtml(size) + ' B' : ''}</div>
                        </div>
                        <div style="display:flex; gap:8px; white-space:nowrap;">
                            ${url ? `<a class="btn-secondary btn-sm" href="${escapeHtml(url)}" target="_blank" rel="noopener">Open</a>` : ''}
                            <button class="btn-secondary btn-sm" type="button" data-projdetail-action="del-attachment" data-id="${escapeHtml(aid)}">Del</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // Cover photo
    const coverId = String(currentProject.cover_attachment_id || '');
    const coverAtt = coverId ? atts.find(a => String(a && a.id) === coverId) : null;
    const coverUrl = coverAtt && coverAtt.url ? String(coverAtt.url) : '';
    if (coverImg && coverEmpty) {
        if (coverUrl) {
            coverImg.src = coverUrl;
            coverImg.style.display = 'block';
            coverEmpty.style.display = 'none';
        } else {
            coverImg.src = '';
            coverImg.style.display = 'none';
            coverEmpty.style.display = 'block';
        }
    }

    // Notes (autosave)
    if (notesTa) {
        if (!notesTa.dataset.bound) {
            notesTa.dataset.bound = '1';
            notesTa.addEventListener('input', () => {
                if (__projdetail_notes_timer) clearTimeout(__projdetail_notes_timer);
                __projdetail_notes_timer = setTimeout(() => {
                    if (!currentProject) return;
                    currentProject.project_notes_text = String(notesTa.value || '');
                    updateProject(currentProject);
                }, 400);
            });
        }
        const curText = String(currentProject.project_notes_text || '');
        if (notesTa.value !== curText) notesTa.value = curText;
    }

    // Comments
    if (btnAddComment && !btnAddComment.dataset.bound) {
        btnAddComment.dataset.bound = '1';
        btnAddComment.onclick = () => {
            const t = commentTa ? String(commentTa.value || '').trim() : '';
            if (!t) return;
            const rec = { id: uid(), text: t, created_at: new Date().toISOString() };
            currentProject.project_comments.unshift(rec);
            updateProject(currentProject);
            if (commentTa) commentTa.value = '';
            renderProjectDetail();
        };
    }
    if (commentsBox) {
        const comments = Array.isArray(currentProject.project_comments) ? currentProject.project_comments : [];
        if (!comments.length) {
            commentsBox.innerHTML = '<div class="muted" style="padding:10px 0;">No comments yet.</div>';
        } else {
            commentsBox.innerHTML = comments.slice(0, 40).map(c => {
                const cid = String(c && c.id ? c.id : '');
                const dt = c && c.created_at ? String(c.created_at).slice(0,19).replace('T',' ') : '';
                const t = c && c.text ? String(c.text) : '';
                return `
                    <div style="border:1px solid #eee; border-radius:12px; padding:10px; margin-bottom:8px; background:#fff;">
                        <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start;">
                            <div class="muted" style="font-size:11px;">${escapeHtml(dt)}</div>
                            <button class="btn-secondary btn-sm" type="button" data-projdetail-action="del-comment" data-id="${escapeHtml(cid)}">Del</button>
                        </div>
                        <div style="margin-top:6px; white-space:pre-wrap;">${escapeHtml(t)}</div>
                    </div>
                `;
            }).join('');
        }
    }

    // Delegated actions inside project detail
    const root = getEl('view-project-detail');
    if (root && !root.dataset.delegated) {
        root.dataset.delegated = '1';
        root.addEventListener('click', async (ev) => {
            const el = ev.target && ev.target.closest ? ev.target.closest('[data-projdetail-action]') : null;
            if (!el) return;
            const action = el.getAttribute('data-projdetail-action');
            const id = el.getAttribute('data-id');
            if (!currentProject) return;
            if (action === 'del-link') {
                currentProject.project_links = (currentProject.project_links || []).filter(x => String(x && x.id) !== String(id));
                updateProject(currentProject);
                renderProjectDetail();
            }
            if (action === 'del-comment') {
                currentProject.project_comments = (currentProject.project_comments || []).filter(x => String(x && x.id) !== String(id));
                updateProject(currentProject);
                renderProjectDetail();
            }
            if (action === 'del-attachment') {
                if (!confirm('Delete attachment?')) return;
                try {
                    await deleteProjectAttachment(String(currentProject.id), String(id));
                    await loadProjectAttachments(String(currentProject.id));
                    // If cover removed
                    if (String(currentProject.cover_attachment_id || '') === String(id)) {
                        currentProject.cover_attachment_id = '';
                        updateProject(currentProject);
                    }
                    renderProjectDetail();
                } catch (err) {
                    alert('Delete failed: ' + (err && err.message ? err.message : String(err)));
                }
            }
        });
    }
}

        function renderSidebarProjects() {
            // legacy alias (kept): use the unified renderer
            renderSidebar();
        }

        function handleCreateProject() {
            const input = getEl('new-project-name');
            const selStatus = getEl('new-project-status');
            const dateRec = getEl('new-project-received');
            const dateBom = getEl('new-project-bom');
            const dateDeadline = getEl('new-project-deadline');
            const dateSent = getEl('new-project-sent');
            const inputSentTo = getEl('new-project-sent-to');

            if (!input || !input.value.trim()) {
                alert('Please enter a project name');
                return;
            }
            if (typeof createProject === 'function') {
                const extraData = {
                    received: dateRec ? dateRec.value : '',
                    bom_received: dateBom ? dateBom.value : '',
                    deadline: dateDeadline ? dateDeadline.value : '',
                    sent: dateSent ? dateSent.value : '',
                    sent_to: inputSentTo ? inputSentTo.value : ''
                };

                const newProj = createProject(input.value.trim(), extraData);
                if (newProj) {
                    // Project status
                    try {
                        const st = selStatus ? String(selStatus.value || '').trim() : '';
                        if (st) newProj.project_status = normStatusValue(st);
                    } catch (e) {}
                    try { updateProject(newProj); } catch (e) {}
                    if (typeof getProjects === 'function') projects = getProjects();
                    currentProject = newProj;
                    localStorage.setItem('rfq_active_project_id', newProj.id);
                    renderDashboardProjects();
                    renderSidebarProjects();
                    renderSidebarProjects();

                    setProjectNameUI(currentProject.name);

                    ensureProjectSuppliers(currentProject);
            syncProjectBatchesIntoMemory(currentProject);
            (currentProject.items || []).forEach(ensureItemShape);
            syncAllBatchesToItems(currentProject);
            updateProject(currentProject);

                    switchView('dashboard');
                    getEl('sheet-new-project').classList.add('hidden');

                    // Clear inputs
                    input.value = '';
                    try { if (selStatus) { fillProjectStatusSelect(selStatus, 'Created'); } } catch (e) {}
                    if (dateRec) dateRec.value = '';
                    if (dateBom) dateBom.value = '';
                    if (dateDeadline) dateDeadline.value = '';
                    if (dateSent) dateSent.value = '';
                    if (inputSentTo) inputSentTo.value = '';
                }
            }
        }

        function openEditProjectModal() {
            if (!currentProject) return;
            const d = currentProject.dates || {};

            getEl('edit-project-name').value = currentProject.name || '';
            getEl('edit-project-received').value = d.received || '';
            getEl('edit-project-bom').value = d.bom_received || '';
            getEl('edit-project-deadline').value = d.deadline || '';
            getEl('edit-project-sent').value = d.sent || '';
            getEl('edit-project-sent-to').value = d.sent_to || '';

            try { fillProjectStatusSelect(getEl('edit-project-status'), getCurrentProjectStatus()); } catch (e) {}

            getEl('sheet-edit-project').classList.remove('hidden');

            const btnUložit = getEl('btn-save-edit-project');
            const btnZrušit = getEl('btn-cancel-edit-project');

            // Remove old listeners to prevent duplicates (simple way: clone and replace, or just ensure one-time setup)
            // Ideally we setup listeners in setupEventListeners, but this is a specific modal handling
            btnUložit.onclick = handleEditProject;
            btnZrušit.onclick = () => getEl('sheet-edit-project').classList.add('hidden');
        }

        function handleEditProject() {
            if (!currentProject) return;

            currentProject.name = getEl('edit-project-name').value.trim();
            try {
                const sel = getEl('edit-project-status');
                const st = sel ? String(sel.value || '').trim() : '';
                if (st) currentProject.project_status = normStatusValue(st);
            } catch (e) {}
            if (!currentProject.dates) currentProject.dates = {};

            currentProject.dates.received = getEl('edit-project-received').value;
            currentProject.dates.bom_received = getEl('edit-project-bom').value;
            currentProject.dates.deadline = getEl('edit-project-deadline').value;
            currentProject.dates.sent = getEl('edit-project-sent').value;
            currentProject.dates.sent_to = getEl('edit-project-sent-to').value;

            if (typeof updateProject === 'function') updateProject(currentProject);

            // UI Updates
            setProjectNameUI(currentProject.name);
            renderSidebarProjects();
            renderDashboard(); // Re-render dashboard to show new dates

            getEl('sheet-edit-project').classList.add('hidden');
        }

        function renderDashboard() {
            // Always render project status / header even if project is empty
            try { renderDashboardProjectStatus(); } catch (e) {}

            // Update Project Info Card
            const elProjName = getEl('dash-project-name');
            const elProjBadge = getEl('dash-project-status-badge');
            const elProjCreated = getEl('dash-info-created');
            const elProjReceived = getEl('dash-info-received');
            const elProjBom = getEl('dash-info-bom');
            const elProjDeadline = getEl('dash-info-deadline');
            const elProjSent = getEl('dash-info-sent');
            const elProjSentTo = getEl('dash-info-sentto');
            const elProjCoverImg = getEl('dash-project-cover-img');
            const elProjCoverIcon = getEl('dash-project-cover-icon');
            const btnDashEdit = getEl('btn-dash-edit-project');

            if (currentProject) {
                const d = currentProject.dates || {};
                const ps = currentProject.project_status || 'Created';

                if (elProjName) elProjName.textContent = currentProject.name || 'Untitled';
                if (elProjBadge) {
                    elProjBadge.textContent = ps;
                    const psL = String(ps).toLowerCase();
                    if (psL.includes('done') || psL.includes('completed')) {
                        elProjBadge.style.background = '#d4edda';
                        elProjBadge.style.color = '#155724';
                    } else if (psL.includes('process') || psL.includes('active')) {
                        elProjBadge.style.background = '#cce5ff';
                        elProjBadge.style.color = '#004085';
                    } else if (psL.includes('hold') || psL.includes('wait')) {
                        elProjBadge.style.background = '#fff3cd';
                        elProjBadge.style.color = '#856404';
                    } else {
                        elProjBadge.style.background = '#e9ecef';
                        elProjBadge.style.color = '#495057';
                    }
                }

                const formatDate = (dateStr) => {
                    if (!dateStr) return '—';
                    try {
                        const dt = new Date(dateStr);
                        if (isNaN(dt.getTime())) return dateStr;
                        return dt.toLocaleDateString();
                    } catch(e) { return dateStr; }
                };

                const createdAt = currentProject.created_at ? formatDate(currentProject.created_at) : '—';
                if (elProjCreated) elProjCreated.innerHTML = `<b>Created:</b> ${createdAt}`;
                if (elProjReceived) elProjReceived.innerHTML = `<b>Received:</b> ${d.received || '—'}`;
                if (elProjBom) elProjBom.innerHTML = `<b>BOM:</b> ${d.bom_received || d.bom || '—'}`;

                // Highlight deadline if approaching
                if (elProjDeadline) {
                    const dl = d.deadline || '';
                    if (dl) {
                        const dlDate = new Date(dl);
                        const today = new Date();
                        const daysLeft = Math.ceil((dlDate - today) / (1000 * 60 * 60 * 24));
                        let color = '#666';
                        if (daysLeft < 0) color = '#dc3545';
                        else if (daysLeft <= 7) color = '#fd7e14';
                        else if (daysLeft <= 14) color = '#ffc107';
                        elProjDeadline.innerHTML = `<b style="color:${color};">Deadline:</b> <span style="color:${color};">${dl}</span>`;
                        if (daysLeft <= 7 && daysLeft >= 0) elProjDeadline.innerHTML += ` <span style="color:${color}; font-size:11px;">(${daysLeft}d left)</span>`;
                        else if (daysLeft < 0) elProjDeadline.innerHTML += ` <span style="color:${color}; font-size:11px;">(overdue!)</span>`;
                    } else {
                        elProjDeadline.innerHTML = `<b>Deadline:</b> —`;
                    }
                }

                if (elProjSent) elProjSent.innerHTML = `<b>Sent:</b> ${d.sent || '—'}`;
                if (elProjSentTo) elProjSentTo.innerHTML = `<b>Sent to:</b> ${escapeHtml(d.sent_to || d.sentTo || '—')}`;

                // Cover image
                if (elProjCoverImg && elProjCoverIcon) {
                    const cover = currentProject.cover_image || currentProject.coverImage;
                    if (cover) {
                        elProjCoverImg.src = cover;
                        elProjCoverImg.style.display = 'block';
                        elProjCoverIcon.style.display = 'none';
                    } else {
                        elProjCoverImg.style.display = 'none';
                        elProjCoverIcon.style.display = 'block';
                    }
                }

                // Edit button
                if (btnDashEdit) btnDashEdit.onclick = openEditProjectModal;
            } else {
                if (elProjName) elProjName.textContent = 'No project selected';
                if (elProjBadge) elProjBadge.textContent = '—';
            }

            if (!currentProject || !currentProject.items) return;

            const itemsRaw = Array.isArray(currentProject.items) ? currentProject.items : [];

            // Normalize items to avoid duplicates
            const getItemKey = (it, idx) => {
                const k = String(it.item_drawing_no || it.drawing_no || it.part_no || it.mpn || it.id || '').trim();
                return k || ('row_' + idx);
            };

            const uniqueMap = new Map();
            itemsRaw.forEach((it, idx) => {
                if (!it || typeof it !== 'object' || it._deleted === true) return;
                const key = getItemKey(it, idx);
                if (!uniqueMap.has(key)) uniqueMap.set(key, it);
            });

            const items = Array.from(uniqueMap.values());
            const total = items.length;

            const normStatus = (it) => String(it.status || it.item_status || '').trim();
            const issues = items.filter(i => normStatus(i) === 'Issue');

            // Calculate values
            const getDefaultQtyKey = (it) => {
                const k = it.award && it.award.default_tier_key ? String(it.award.default_tier_key) : 'qty_1';
                return /^qty_\d+$/.test(k) ? k : 'qty_1';
            };
            const getTierIndex = (qtyKey) => {
                const n = parseInt(String(qtyKey).split('_')[1] || '1', 10);
                return Number.isFinite(n) && n > 0 ? n : 1;
            };

            let totalVal = 0;
            const supplierValues = {};
            const supplierCounts = {};

            items.forEach(it => {
                const qtyKey = getDefaultQtyKey(it);
                const tierIdx = getTierIndex(qtyKey);
                const qty = parseFloat(it[qtyKey]) || parseFloat(it.qty_1) || 1;
                const priceEuro = parseFloat(it['price_' + tierIdx + '_euro']) || parseFloat(it.price_1_euro) || 0;
                const itemValue = priceEuro * qty;
                totalVal += itemValue;

                const supplier = it.supplier || 'Unknown';
                supplierValues[supplier] = (supplierValues[supplier] || 0) + itemValue;
                supplierCounts[supplier] = (supplierCounts[supplier] || 0) + 1;
            });

            // Get RFQ batches
            const rfqBatches = Array.isArray(currentProject.rfqBatches || currentProject.rfq_batches)
                ? (currentProject.rfqBatches || currentProject.rfq_batches) : [];

            // Count items by quote status
            const itemsWithQuote = items.filter(it => {
                const s = normStatus(it);
                return s === 'Quote Received' || s === 'Won' || s === 'Lost' || s === 'Done';
            });
            const itemsAwaitingQuote = items.filter(it => normStatus(it) === 'RFQ Sent');
            const itemsNotSent = items.filter(it => normStatus(it) === 'New' || !normStatus(it));

            // Calculate metrics
            const uniqueSuppliers = Object.keys(supplierCounts).filter(s => s !== 'Unknown').length;
            const quoteRate = total > 0 ? Math.round((itemsWithQuote.length / total) * 100) : 0;
            const avgPrice = total > 0 ? totalVal / total : 0;

            // Update key metrics
            const elTotal = getEl('dash-total-items');
            const elValue = getEl('dash-total-value');
            const elSupplierCount = getEl('dash-supplier-count');
            const elQuoteRate = getEl('dash-quote-rate');
            const elAvgPrice = getEl('dash-avg-price');

            if (elTotal) elTotal.textContent = total;
            if (elValue) elValue.textContent = '€' + totalVal.toFixed(0);
            if (elSupplierCount) elSupplierCount.textContent = uniqueSuppliers;
            if (elQuoteRate) elQuoteRate.textContent = quoteRate + '%';
            if (elAvgPrice) elAvgPrice.textContent = '€' + avgPrice.toFixed(0);

            // Quoting progress
            const elRfqBatches = getEl('dash-rfq-batches');
            const elQuotesReceived = getEl('dash-quotes-received');
            const elAwaitingQuote = getEl('dash-awaiting-quote');
            const elNotSent = getEl('dash-not-sent');

            if (elRfqBatches) elRfqBatches.textContent = rfqBatches.length;
            if (elQuotesReceived) elQuotesReceived.textContent = itemsWithQuote.length;
            if (elAwaitingQuote) elAwaitingQuote.textContent = itemsAwaitingQuote.length;
            if (elNotSent) elNotSent.textContent = itemsNotSent.length;

            // Item Status breakdown
            const breakdownEl = getEl('dash-status-breakdown');
            if (breakdownEl) {
                const counts = {};
                items.forEach(it => {
                    const s = normStatus(it) || 'New';
                    counts[s] = (counts[s] || 0) + 1;
                });

                const preferredOrder = ITEM_STATUSES;
                const labels = [...preferredOrder].filter(s => counts[s]);
                const totalCount = Math.max(1, total);

                const rowsHtml = labels.map(s => {
                    const c = counts[s] || 0;
                    const pctLabel = Math.round((c / totalCount) * 100);
                    const pct = Math.max(2, pctLabel);
                    return `
                        <div class="dash-status-row">
                            <div class="dash-status-name">${escapeHtml(s)}</div>
                            <div class="dash-status-bar">
                                <div class="dash-status-fill" style="width:${pct}%; background:${getStatusColorUnified(s)};"></div>
                            </div>
                            <div class="dash-status-pct">${pctLabel}%</div>
                            <div class="dash-status-count">${c}</div>
                        </div>
                    `;
                }).join('');

                breakdownEl.innerHTML = rowsHtml || `<div class="muted" style="font-size:12px;">No items</div>`;
            }

            // Project dates (compact inline)
            const datesContainer = getEl('dashboard-dates-container');
            if (datesContainer) {
                const d = currentProject.dates || {};
                const hasDeadline = d.deadline;
                datesContainer.innerHTML = `
                    <div style="display: flex; gap: 20px; align-items: center; font-size: 12px;">
                        ${d.deadline ? `<span style="color: #FF3B30; font-weight: 600;">Deadline: ${d.deadline}</span>` : ''}
                        ${d.received ? `<span style="color: #666;">Received: ${d.received}</span>` : ''}
                        <button id="btn-edit-project-details" class="btn-secondary btn-sm">Edit Dates</button>
                    </div>
                `;
                setTimeout(() => {
                    const btnEdit = document.getElementById('btn-edit-project-details');
                    if (btnEdit) btnEdit.onclick = openEditProjectModal;
                }, 0);
            }

            // Issues Widget
            const issuesContainer = getEl('dashboard-issues-container');
            if (issues.length > 0) {
                issuesContainer.innerHTML = `
                    <div class="chart-card" style="margin-top: 20px; background: #fff5f5; border-color: #ffcccc;">
                        <h3 style="color: #c00; display: flex; align-items: center; gap: 8px;">
                            Attention Needed <span style="background: #c00; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px;">${issues.length}</span>
                        </h3>
                        <div class="table-wrapper" style="max-height: 150px; overflow: auto;">
                            <table class="rfq-table" style="background: white;">
                                <thead><tr><th>Item</th><th>Description</th><th>Note</th><th></th></tr></thead>
                                <tbody>
                                    ${issues.map(item => `
                                        <tr>
                                            <td><b>${escapeHtml(item.item_drawing_no || '?')}</b></td>
                                            <td>${escapeHtml(item.description || '-')}</td>
                                            <td style="color: #c00;">${escapeHtml(item.notes || 'Marked as Issue')}</td>
                                            <td><button class="btn-text" onclick="if(window.openItemInProject) window.openItemInProject('${currentProject.id}', '${item.item_drawing_no}');">View</button></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
                issuesContainer.classList.remove('hidden');
            } else if (issuesContainer) {
                issuesContainer.innerHTML = '';
                issuesContainer.classList.add('hidden');
            }

            // Render Charts
            renderCharts(items, supplierValues);

            // Top 10 Table (by total value)
            const itemsWithValue = items.map(it => {
                const qtyKey = getDefaultQtyKey(it);
                const tierIdx = getTierIndex(qtyKey);
                const qty = parseFloat(it[qtyKey]) || parseFloat(it.qty_1) || 1;
                const unitPrice = parseFloat(it['price_' + tierIdx + '_euro']) || parseFloat(it.price_1_euro) || 0;
                return { ...it, _qty: qty, _unitPrice: unitPrice, _totalValue: unitPrice * qty };
            });

            const top10 = itemsWithValue.sort((a, b) => b._totalValue - a._totalValue).slice(0, 10);

            const tbody = getEl('table-top-10')?.querySelector('tbody');
            if (tbody) {
                tbody.innerHTML = top10.map((item, idx) => {
                    // Find the actual index in currentProject.items
                    const actualIndex = currentProject.items.findIndex(it =>
                        it.item_drawing_no === item.item_drawing_no && it.description === item.description
                    );
                    return `
                    <tr>
                        <td><a href="#" class="top10-part-link" data-index="${actualIndex}" style="color: #007AFF; text-decoration: none; font-weight: 600; cursor: pointer;">${escapeHtml(item.item_drawing_no || '?')}</a></td>
                        <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(item.description || '-')}</td>
                        <td>${item._qty}</td>
                        <td>€${item._unitPrice.toFixed(2)}</td>
                        <td style="font-weight: 600;">€${item._totalValue.toFixed(0)}</td>
                        <td>${escapeHtml(item.supplier || '-')}</td>
                        <td><span style="padding: 2px 8px; border-radius: 4px; font-size: 11px; background: ${getStatusColorUnified(item.status || 'New')}; color: white;">${escapeHtml(item.status || 'New')}</span></td>
                    </tr>
                `}).join('');

                // Add click handlers for part number links
                tbody.querySelectorAll('.top10-part-link').forEach(link => {
                    link.onclick = (e) => {
                        e.preventDefault();
                        const index = parseInt(link.dataset.index);
                        if (index >= 0 && currentProject && currentProject.items[index]) {
                            openItemDetail(index);
                        }
                    };
                });
            }

            updateStats();
        }

        function renderDashboardProjects() {
            const select = getEl('dashboard-project-select');
            if (!select) return;
            select.innerHTML = '';
            projects.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.textContent = p.name;
                if (currentProject && p.id === currentProject.id) opt.selected = true;
                select.appendChild(opt);
            });
        }

        function getISOWeekNumber(date) {
    const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = tmp.getUTCDay() || 7; // Mon=1..Sun=7
    tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    return Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
}

function updateMenuTime() {
    const d = new Date();
    const week = getISOWeekNumber(d);
    const dateStr = d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' });
    const timeStr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const txt = `${dateStr} • ${timeStr} • Týden ${week}`;

    const el = document.getElementById('menu-time');
    if (el) el.textContent = txt;

    const top = document.getElementById('topbar-datetime');
    if (top) top.textContent = txt;
}

function renderSuppliers() {
            if (!currentProject || !currentProject.items) {
                getEl('bulk-pricing-empty').classList.remove('hidden');
                getEl('bulk-pricing-table-wrapper').classList.add('hidden');
                // Topbar Upload Quote should be disabled if no project
                try {
                    const topBtn = getEl('btn-topbar-upload-quote');
                    if (topBtn) { topBtn.disabled = true; topBtn.title = 'Select a project and supplier first.'; }
                } catch (e) {}
                return;
            }

            const syncTopbarUploadQuoteState = () => {
                const topBtn = getEl('btn-topbar-upload-quote');
                if (!topBtn) return;
                const sel = getEl('bulk-supplier-select');
                const name = sel ? String(sel.value || '').trim() : '';
                topBtn.disabled = false;
                topBtn.title = name ? `Upload quote file for: ${name}` : 'No supplier selected — click to open Suppliers and choose one.';
            };

            // Get unique supplier names (robust: supplier master + legacy + item targeting)
            const supplierSet = new Set();

            // 1) Supplier master DB (if present)
            try {
                const sm = currentProject.supplierMaster || currentProject.supplier_master || null;
                if (Array.isArray(sm)) {
                    sm.forEach(s => {
                        const n = (s && (s.name || s.supplier_name)) ? String(s.name || s.supplier_name).trim() : '';
                        if (n) supplierSet.add(n);
                    });
                } else if (sm && typeof sm === 'object') {
                    Object.values(sm).forEach(s => {
                        const n = (s && (s.name || s.supplier_name)) ? String(s.name || s.supplier_name).trim() : '';
                        if (n) supplierSet.add(n);
                    });
                }
            } catch(e){}

            // 2) Legacy supplierData
            try {
                const sd = currentProject.supplierData || currentProject.supplier_data || null;
                if (Array.isArray(sd)) {
                    sd.forEach(s => {
                        const n = (s && (s.name || s.supplier_name)) ? String(s.name || s.supplier_name).trim() : '';
                        if (n) supplierSet.add(n);
                    });
                } else if (sd && typeof sd === 'object') {
                    Object.values(sd).forEach(s => {
                        const n = (s && (s.name || s.supplier_name)) ? String(s.name || s.supplier_name).trim() : '';
                        if (n) supplierSet.add(n);
                    });
                }
            } catch(e){}

            // 3) Item-level suppliers + legacy main supplier
            (currentProject.items || []).forEach(item => {
                try {
                    if (item && item.suppliers && Array.isArray(item.suppliers)) {
                        item.suppliers.forEach(sup => {
                            const n = sup && (sup.name || sup.supplier || sup.supplier_name);
                            if (n && String(n).trim()) supplierSet.add(String(n).trim());
                        });
                    }
                    if (item && item.supplier && String(item.supplier).trim()) {
                        supplierSet.add(String(item.supplier).trim());
                    }
                } catch(e){}
            });
            // Ensure Upload Quote button exists (some builds re-render toolbar without it)
            (function ensureBulkUploadButton(){
                try {
                    const view = getEl('view-suppliers');
                    const toolbarRight = view ? view.querySelector('.toolbar > div:last-child') : null;
                    if (!toolbarRight) return;
                    let btn = getEl('btn-upload-bulk-quote');
                    if (!btn) {
                        btn = document.createElement('button');
                        btn.id = 'btn-upload-bulk-quote';
                        btn.className = 'btn-secondary';
                        btn.style.fontSize = '11px';
                        btn.textContent = '📄 Upload Quote';
                        btn.disabled = true;
                        const saveBtn = getEl('btn-save-bulk-prices');
                        if (saveBtn && saveBtn.parentElement === toolbarRight) {
                            toolbarRight.insertBefore(btn, saveBtn);
                        } else {
                            toolbarRight.appendChild(btn);
                        }
                    }
                    btn.style.display = 'inline-flex';
                } catch(e) { console.error(e); }
            })();

            // Populate supplier dropdown
            const select = getEl('bulk-supplier-select');
            if (select) {
                const currentValue = select.value;
                select.innerHTML = '<option value="">-- Select Supplier --</option>';

                Array.from(supplierSet).sort().forEach(supplierName => {
                    const opt = document.createElement('option');
                    opt.value = supplierName;
                    opt.textContent = supplierName;
                    select.appendChild(opt);
                });

                // Restore selection if valid
                if (currentValue && supplierSet.has(currentValue)) {
                    select.value = currentValue;
                    try {
                        populateBulkPricingTable(currentValue, bulkCurrentPage || 1);
                        const uploadBtn = getEl('btn-upload-bulk-quote');
                        if (uploadBtn) { uploadBtn.style.display = 'inline-flex'; uploadBtn.disabled = false; }
                        try { syncTopbarUploadQuoteState(); } catch(e) {}
                    } catch(e) { console.error(e); }
                }
            }

            // Set up event listeners
            if (select && !select.dataset.listenerAdded) {
                select.addEventListener('change', () => {
                    if (select.value) {
                        populateBulkPricingTable(select.value);
                        // Show upload quote button
                        const uploadBtn = getEl('btn-upload-bulk-quote');
                        if (uploadBtn) { uploadBtn.style.display = 'inline-flex'; uploadBtn.disabled = false; }
                        try { syncTopbarUploadQuoteState(); } catch(e) {}
                    } else {
                        getEl('bulk-pricing-empty').classList.remove('hidden');
                        getEl('bulk-pricing-table-wrapper').classList.add('hidden');
                        getEl('btn-save-bulk-prices').disabled = true;
                        // Hide upload quote button
                        const uploadBtn = getEl('btn-upload-bulk-quote');
                        if (uploadBtn) { uploadBtn.style.display = 'inline-flex'; uploadBtn.disabled = true; uploadBtn.textContent='📄 Upload Quote'; uploadBtn.style.background=''; uploadBtn.style.color=''; }
                        try { window.bulkQuoteFile = null; } catch(e){}
                    try { syncTopbarUploadQuoteState(); } catch(e) {}
                    }
                });
                select.dataset.listenerAdded = 'true';
            }

            const btnUložit = getEl('btn-save-bulk-prices');
            if (btnUložit && !btnUložit.dataset.listenerAdded) {
                btnUložit.addEventListener('click', saveBulkPrices);
                btnUložit.dataset.listenerAdded = 'true';
            }

            // Setup Upload Quote button (attachment + optional Excel/CSV import)
const btnUploadQuote = getEl('btn-upload-bulk-quote');
if (btnUploadQuote && !btnUploadQuote.dataset.listenerAdded) {
    btnUploadQuote.addEventListener('click', () => {
        const supplierSel = getEl('bulk-supplier-select');
        const supplierName = supplierSel ? String(supplierSel.value || '').trim() : '';
        if (!supplierName) {
            alert('Select supplier first.');
            return;
        }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls,.csv,.tsv,.pdf,.doc,.docx,.png,.jpg,.jpeg';
        input.onchange = (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;

            if (file.size > 10 * 1024 * 1024) {
                alert('File too large! Maximum size is 10MB.');
                return;
            }

            const ext = String(file.name || '').split('.').pop().toLowerCase();

            // Always keep attachment (base64) for traceability
            const keepAttachment = () => new Promise((resolve) => {
                const r = new FileReader();
                r.onload = (ev) => {
                    try {
                        window.bulkQuoteFile = { filename: file.name, data: ev.target.result };
                    } catch (e) {}
                    resolve(true);
                };
                r.readAsDataURL(file);
            });

            const importDoneUI = (msg) => {
                btnUploadQuote.textContent = `✓ ${file.name.substring(0, 18)}…`;
                btnUploadQuote.style.background = '#34c759';
                btnUploadQuote.style.color = 'white';
                if (msg) alert(msg);
            };

            // Import: Excel / CSV / TSV
            const doImport = async () => {
                if (ext === 'xlsx' || ext === 'xls') {
                    if (!window.XLSX) {
                        await keepAttachment();
                        alert('Excel library not loaded. File stored as attachment only.');
                        return;
                    }
                    const r = new FileReader();
                    r.onload = async (ev) => {
                        try {
                            const data = new Uint8Array(ev.target.result);
                            const wb = window.XLSX.read(data, { type: 'array' });
                            const sheetName = wb.SheetNames[0];
                            const ws = wb.Sheets[sheetName];
                            const rows = window.XLSX.utils.sheet_to_json(ws, { defval: '' });
                            const res = bulkApplyImportedRows(supplierName, rows);
                            await keepAttachment();
                            try { populateBulkPricingTable(supplierName, bulkCurrentPage || 1); } catch(e){}
                            importDoneUI(`Import OK. Updated: ${res.updated}, skipped: ${res.skipped}`);
                        } catch (err) {
                            console.error(err);
                            await keepAttachment();
                            alert('Import failed: ' + (err && err.message ? err.message : String(err)));
                        }
                    };
                    r.readAsArrayBuffer(file);
                    return;
                }

                if (ext === 'csv' || ext === 'tsv') {
                    const r = new FileReader();
                    r.onload = async (ev) => {
                        try {
                            const text = String(ev.target.result || '');
                            const delim = ext === 'tsv' ? '\t' : (text.includes(';') && !text.includes(',') ? ';' : ',');
                            const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
                            if (lines.length < 2) throw new Error('Empty CSV');
                            const headers = lines[0].split(delim).map(h => h.trim());
                            const rows = lines.slice(1).map(line => {
                                const cols = line.split(delim);
                                const o = {};
                                headers.forEach((h, i) => { o[h] = (cols[i] ?? '').trim(); });
                                return o;
                            });
                            const res = bulkApplyImportedRows(supplierName, rows);
                            await keepAttachment();
                            try { populateBulkPricingTable(supplierName, bulkCurrentPage || 1); } catch(e){}
                            importDoneUI(`Import OK. Updated: ${res.updated}, skipped: ${res.skipped}`);
                        } catch (err) {
                            console.error(err);
                            await keepAttachment();
                            alert('Import failed: ' + (err && err.message ? err.message : String(err)));
                        }
                    };
                    r.readAsText(file);
                    return;
                }

                // Non-import types: just attachment
                await keepAttachment();
                importDoneUI('File attached to Bulk Pricing session.');
            };

            doImport();
        };
        input.click();
    });
    btnUploadQuote.dataset.listenerAdded = 'true';
}

// Multi-Supplier Upload Handler
const btnMultiSupplier = getEl('btn-upload-multi-supplier');
if (btnMultiSupplier && !btnMultiSupplier.dataset.listenerAdded) {
    btnMultiSupplier.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls,.csv';
        input.onchange = async (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;

            if (file.size > 10 * 1024 * 1024) {
                alert('File too large! Maximum size is 10MB.');
                return;
            }

            const ext = String(file.name || '').split('.').pop().toLowerCase();

            if (ext === 'xlsx' || ext === 'xls') {
                // Excel import
                if (!window.XLSX) {
                    alert('Excel library not loaded. Please refresh the page and try again.');
                    return;
                }
                const r = new FileReader();
                r.onload = (ev) => {
                    try {
                        const data = new Uint8Array(ev.target.result);
                        const wb = window.XLSX.read(data, { type: 'array' });
                        const sheetName = wb.SheetNames[0];
                        const ws = wb.Sheets[sheetName];
                        const rows = window.XLSX.utils.sheet_to_json(ws, { defval: '' });
                        const res = parseMultiSupplierRows(rows);
                        alert(`Multi-Supplier Import Complete!\nUpdated: ${res.updated} items\nSkipped: ${res.skipped} rows\nSuppliers: ${res.suppliers.size}`);
                        // Refresh the table if a supplier is selected
                        const sel = getEl('bulk-supplier-select');
                        if (sel && sel.value) {
                            populateBulkPricingTable(sel.value, bulkCurrentPage || 1);
                        }
                    } catch (err) {
                        console.error(err);
                        alert('Import failed: ' + (err && err.message ? err.message : String(err)));
                    }
                };
                r.readAsArrayBuffer(file);
            } else if (ext === 'csv') {
                // CSV import
                const r = new FileReader();
                r.onload = (ev) => {
                    try {
                        const text = String(ev.target.result || '');
                        const delim = text.includes(';') && !text.includes(',') ? ';' : ',';
                        const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
                        if (lines.length < 2) throw new Error('Empty CSV');
                        const headers = lines[0].split(delim).map(h => h.trim());
                        const rows = lines.slice(1).map(line => {
                            const cols = line.split(delim);
                            const o = {};
                            headers.forEach((h, i) => { o[h] = (cols[i] ?? '').trim(); });
                            return o;
                        });
                        const res = parseMultiSupplierRows(rows);
                        alert(`Multi-Supplier Import Complete!\nUpdated: ${res.updated} items\nSkipped: ${res.skipped} rows\nSuppliers: ${res.suppliers.size}`);
                        const sel = getEl('bulk-supplier-select');
                        if (sel && sel.value) {
                            populateBulkPricingTable(sel.value, bulkCurrentPage || 1);
                        }
                    } catch (err) {
                        console.error(err);
                        alert('Import failed: ' + (err && err.message ? err.message : String(err)));
                    }
                };
                r.readAsText(file);
            }
        };
        input.click();
    });
    btnMultiSupplier.dataset.listenerAdded = 'true';
}

// Multi-supplier parsing function
function parseMultiSupplierRows(rows) {
    const result = { updated: 0, skipped: 0, suppliers: new Set() };

    if (!currentProject || !Array.isArray(currentProject.items)) {
        return result;
    }

    (rows || []).forEach(row => {
        // Find part number
        const partNo = row.PartNo || row['Part No'] || row.DrawingNo || row['Drawing No'] ||
                       row.drawing_no || row.part_no || row.MPN || row.mpn || row.item_drawing_no || '';
        const supplierName = String(row.Supplier || row.supplier || row.SupplierName || '').trim();

        if (!partNo || !supplierName) {
            result.skipped++;
            return;
        }

        // Find item by part number
        const item = currentProject.items.find(it => {
            const dn = String(it.item_drawing_no || it.drawing_no || it.part_no || it.mpn || '').trim().toUpperCase();
            return dn === String(partNo).trim().toUpperCase();
        });

        if (!item) {
            result.skipped++;
            return;
        }

        // Parse "Main" flag
        const mainVal = String(row.Main || row.main || row.IsMain || row.isMain || '').toLowerCase();
        const isMain = ['yes', 'true', '1', 'ano', 'x'].includes(mainVal);

        // Collect qty/price pairs dynamically (supports up to 20 tiers)
        const prices = [];
        for (let i = 1; i <= 20; i++) {
            const qtyVal = row['Qty_' + i] || row['qty_' + i] || row['Qty' + i] || row['qty' + i] || row['QTY_' + i];
            const priceVal = row['Price_' + i] || row['price_' + i] || row['Price' + i] || row['price' + i] || row['PRICE_' + i];

            const qty = parseFloat(String(qtyVal || '').replace(',', '.'));
            const price = parseFloat(String(priceVal || '').replace(',', '.'));

            if (qty > 0 && !isNaN(price) && price >= 0) {
                prices.push({ qty, price });
            }
        }

        // Also support Price@QTY1, Price@QTY2, etc. format
        for (let i = 1; i <= 10; i++) {
            const priceVal = row['Price @QTY' + i] || row['Price@QTY' + i] || row['Price_QTY' + i];
            if (priceVal !== undefined && priceVal !== '') {
                const price = parseFloat(String(priceVal).replace(',', '.'));
                // Use item's qty tiers
                const qtyKey = 'qty_' + i;
                const qty = parseFloat(item[qtyKey]) || 0;
                if (qty > 0 && !isNaN(price) && price >= 0) {
                    // Check if we already have this qty
                    if (!prices.find(p => p.qty === qty)) {
                        prices.push({ qty, price });
                    }
                }
            }
        }

        // If no price pairs found, skip
        if (prices.length === 0) {
            result.skipped++;
            return;
        }

        // Ensure item has suppliers array
        ensureItemShape(item);

        // Find or create supplier entry
        let entry = item.suppliers.find(s => s.name === supplierName);
        if (!entry) {
            entry = {
                id: Date.now() + Math.random(),
                name: supplierName,
                prices: [],
                currency: 'EUR',
                isMain: false
            };
            item.suppliers.push(entry);
        }

        // Update supplier entry
        entry.prices = prices;
        entry.currency = String(row.Currency || row.currency || entry.currency || 'EUR').trim().toUpperCase() || 'EUR';
        if (row.MOQ || row.moq) entry.moq = String(row.MOQ || row.moq).trim();
        if (row.MOV || row.mov) entry.mov = String(row.MOV || row.mov).trim();
        if (row.LeadTime || row['Lead Time'] || row.lead_time) {
            entry.lead_time = String(row.LeadTime || row['Lead Time'] || row.lead_time).trim();
        }
        if (row.Shipping || row.shipping) entry.shipping = String(row.Shipping || row.shipping).trim();
        if (row.QuoteNumber || row['Quote #'] || row.quote_number) {
            entry.quote_number = String(row.QuoteNumber || row['Quote #'] || row.quote_number).trim();
        }
        if (row.Incoterms || row.incoterms) entry.incoterms = String(row.Incoterms || row.incoterms).trim();

        // Handle Main supplier flag
        if (isMain) {
            // Clear isMain from other suppliers
            item.suppliers.forEach(s => { s.isMain = false; });
            entry.isMain = true;

            // Set item's main supplier fields
            item.supplier = supplierName;
            if (prices[0]) {
                item.price_1 = prices[0].price;
            }
            if (prices[1]) {
                item.price_2 = prices[1].price;
            }
            item.currency = entry.currency;
            if (entry.shipping) item.shipping_cost = entry.shipping;
        }

        // Update legacy price fields on supplier
        if (prices[0]) entry.price = prices[0].price;
        if (prices[1]) entry.price_2 = prices[1].price;

        result.updated++;
        result.suppliers.add(supplierName);
    });

    // Persist changes
    try {
        updateProject(currentProject);
        // Refresh UI
        try { renderCompactTable(); } catch(e) {}
        try { updateStats(); } catch(e) {}
        try { updateSupplierFilter(); } catch(e) {}
    } catch(e) {
        console.error('Failed to save multi-supplier import:', e);
    }

    return result;
}


            const btnAddNewSupplier = getEl('btn-add-new-supplier');
            if (btnAddNewSupplier && !btnAddNewSupplier.dataset.listenerAdded) {
                btnAddNewSupplier.addEventListener('click', () => {
                    const newName = prompt('Enter new supplier name:');
                    if (newName && newName.trim()) {
                        select.innerHTML += `<option value="${newName.trim()}">${newName.trim()}</option>`;
                        select.value = newName.trim();
                        select.dispatchEvent(new Event('change'));
                    }
                });
                btnAddNewSupplier.dataset.listenerAdded = 'true';
            }

            // If supplier is selected, populate table
            if (select && select.value) {
                populateBulkPricingTable(select.value);
            }
            try { syncTopbarUploadQuoteState(); } catch(e) {}
        }

        function saveBulkPageToMemory() {
            const tbody = document.querySelector('#table-bulk-pricing tbody');
            if (!tbody) return;
            const supplierName = getEl('bulk-supplier-select')?.value;
            if (!supplierName) return;

            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                const firstInput = row.querySelector('.bulk-row-checkbox');
                if (!firstInput) return;
                const index = parseInt(firstInput.dataset.index);
                if (isNaN(index)) return;

                const item = currentProject.items[index];
            ensureItemShape(item);
            if (!item) return;

                const priceInputs = row.querySelectorAll('.price-qty-input');
                let hasAnyPrice = false;
                const prices = [];

                const itemQtys = [
                    parseFloat(item.qty_1) || 0,
                    parseFloat(item.qty_2) || 0,
                    parseFloat(item.qty_3) || 0,
                    parseFloat(item.qty_4) || 0,
                    parseFloat(item.qty_5) || 0
                ];

                priceInputs.forEach((input, qtyIdx) => {
                    const qtyValue = itemQtys[qtyIdx];
                    if (qtyValue === 0) return;
                    const val = input.value.trim();
                    if (val) {
                        prices.push({ qty: qtyValue, price: val });
                        hasAnyPrice = true;
                    }
                });

                const currency = row.querySelector('.currency-select')?.value || 'EUR';
                const moq = row.querySelector('.moq-input')?.value.trim() || '';
                const mov = row.querySelector('.mov-input')?.value.trim() || '';
                const quote = row.querySelector('.quote-input')?.value.trim() || '';
                const lead = row.querySelector('.leadtime-input')?.value.trim() || '';
                const shipping = row.querySelector('.shipping-input')?.value.trim() || '';
                const isMain = row.querySelector('.bulk-main-checkbox')?.checked || false;

                if (hasAnyPrice) {
                    if (!item.suppliers) item.suppliers = [];
                    const existingIndex = item.suppliers.findIndex(s => s.name === supplierName);

                    const supplierData = {
                        id: existingIndex >= 0 ? item.suppliers[existingIndex].id : Date.now() + index,
                        name: supplierName,
                        prices: prices,
                        currency: currency,
                        moq: moq,
                        mov: mov,
                        quote_number: quote,
                        lead_time: lead,
                        shipping: shipping,
                        isMain: isMain,
                        price: prices[0]?.price || '',
                        price_2: prices[1]?.price || ''
                    };

                    if (existingIndex >= 0) {
                        item.suppliers[existingIndex] = supplierData;
                    } else {
                        item.suppliers.push(supplierData);
                    }

                    if (isMain) {
                        item.suppliers.forEach(s => { if (s.name !== supplierName) s.isMain = false; });
                        item.supplier = supplierName;
                        item.price_1 = prices[0]?.price || '';
                        item.price_2 = prices[1]?.price || '';
                        item.currency = currency;
                        item.shipping_cost = shipping;
                    }
                    calculateEuroValues(item);
                }
            });

            // Persist bulk edits once (avoid per-row updates)
            try {
                syncProjectBatchesIntoMemory(currentProject);
                syncAllBatchesToItems(currentProject);
                updateProject(currentProject);
            } catch (e) {
                console.warn('Bulk pricing memory sync failed:', e);
            }
        }

        function populateBulkPricingTable(supplierName, page = 1) {
            if (!currentProject || !currentProject.items) return;

            getEl('bulk-pricing-empty').classList.add('hidden');
            getEl('bulk-pricing-table-wrapper').classList.remove('hidden');

            const table = document.querySelector('#table-bulk-pricing');
            const thead = table?.querySelector('thead');
            const tbody = table?.querySelector('tbody');
            if (!thead || !tbody) return;

            let filteredItems = currentProject.items;

            const tAny = (bulkPricingFilterText || '').trim().toLowerCase();
            const tPart = (bulkPricingFilterPart || '').trim().toLowerCase();
            const tMfr = (bulkPricingFilterMfr || '').trim().toLowerCase();
            const tDesc = (bulkPricingFilterDesc || '').trim().toLowerCase();

            if (tAny || tPart || tMfr || tDesc) {
                filteredItems = currentProject.items.filter(item => {
                    const partStr = [
                        item.item_drawing_no, item.line, item.drawing_no, item.part_no, item.part_number,
                        item.mpn, item.mfg_part_no, item.part, item.partno
                    ].filter(Boolean).join(' ').toLowerCase();

                    const mfrStr = [
                        item.manufacturer, item.mfr, item.maker, item.brand
                    ].filter(Boolean).join(' ').toLowerCase();

                    const descStr = [
                        item.description, item.desc
                    ].filter(Boolean).join(' ').toLowerCase();

                    const anyStr = (partStr + ' ' + mfrStr + ' ' + descStr).trim();

                    if (tPart && !partStr.includes(tPart)) return false;
                    if (tMfr && !mfrStr.includes(tMfr)) return false;
                    if (tDesc && !descStr.includes(tDesc)) return false;
                    if (tAny && !anyStr.includes(tAny)) return false;

                    return true;
                });
            }

            const totalPages = Math.ceil(filteredItems.length / bulkItemsPerPage) || 1;

            if (page < 1) page = 1;
            if (page > totalPages) page = totalPages;
            bulkCurrentPage = page;

            renderBulkToolbar(supplierName, filteredItems.length);

            const headerRow = `
                <tr>
                    <th style="width: 40px;"><input type="checkbox" id="bulk-select-all"></th>
                    <th style="width: 100px;">Part No.</th>
                    <th style="width: 200px;">Description</th>
                    <th style="width: 90px;">Price @QTY1</th>
                    <th style="width: 90px;">Price @QTY2</th>
                    <th style="width: 90px;">Price @QTY3</th>
                    <th style="width: 90px;">Price @QTY4</th>
                    <th style="width: 90px;">Price @QTY5</th>
                    <th style="width: 80px;">Currency</th>
                    <th style="width: 80px;">MOQ</th>
                    <th style="width: 80px;">MOV</th>
                    <th style="width: 120px;">Quote #</th>
                    <th style="width: 100px;">Lead Time</th>
                    <th style="width: 80px;">Shipping</th>
                    <th style="width: 70px;">Main</th>
                </tr>
            `;
            thead.innerHTML = headerRow;

            const startIndex = (bulkCurrentPage - 1) * bulkItemsPerPage;
            const endIndex = Math.min(startIndex + bulkItemsPerPage, filteredItems.length);
            const visibleItems = filteredItems.slice(startIndex, endIndex);

            let rowsHtml = '';
            visibleItems.forEach((item, sliceIndex) => {
                const globalIndex = currentProject.items.indexOf(item);
                const existingSupplier = item.suppliers?.find(s => s.name === supplierName);

                const itemQtys = [
                    parseFloat(item.qty_1) || 0,
                    parseFloat(item.qty_2) || 0,
                    parseFloat(item.qty_3) || 0,
                    parseFloat(item.qty_4) || 0,
                    parseFloat(item.qty_5) || 0
                ];

                const existingPrices = existingSupplier?.prices || [];
                const currentCurrency = existingSupplier?.currency || item.currency || 'EUR';
                const currentMOQ = existingSupplier?.moq || '';
                const currentMOV = existingSupplier?.mov || '';
                const currentQuoteNumber = existingSupplier?.quote_number || '';
                const currentLeadTime = existingSupplier?.lead_time || '';
                const currentShippingRaw = (existingSupplier && (existingSupplier.shipping ?? existingSupplier.shipping_cost)) ?? item.shipping_cost ?? '';
                const currentShipping = toNumberInputValue(currentShippingRaw);
                const isMain = existingSupplier?.isMain || false;

                const priceColumns = itemQtys.map((qty, qtyIdx) => {
                    if (qty === 0) return `<td style="background: #f5f5f5;"><span style="color: #999; font-size: 11px;">-</span></td>`;
                    const existingPrice = existingPrices.find(p => p.qty === qty);
                    const currentValue = existingPrice?.price || '';
                    return `
                        <td>
                            <input type="number" step="0.01" class="bulk-input price-qty-input" 
                                data-index="${globalIndex}" data-qty="${qty}" data-qty-index="${qtyIdx}"
                                placeholder="@${qty}" value="" style="width: 85px; font-size: 11px;" title="Price for ${qty}">
                            ${currentValue ? `<div style="font-size: 10px; color: #999; pointer-events:none;">Was: ${currentValue}</div>` : ''}
                        </td>`;
                }).join('');

                rowsHtml += `
                    <tr>
                        <td><input type="checkbox" class="bulk-row-checkbox" data-index="${globalIndex}"></td>
                        <td style="font-weight: 600;">${item.item_drawing_no || item.line || '-'}</td>
                        <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px;" title="${item.description}">${item.description || '-'}</td>
                        ${priceColumns}
                        <td>
                            <select class="bulk-input currency-select" data-index="${globalIndex}" style="width: 75px; font-size: 11px;">
                                <option value="EUR" ${currentCurrency === 'EUR' ? 'selected' : ''}>EUR</option>
                                <option value="USD" ${currentCurrency === 'USD' ? 'selected' : ''}>USD</option>
                                <option value="CZK" ${currentCurrency === 'CZK' ? 'selected' : ''}>CZK</option>
                                <option value="GBP" ${currentCurrency === 'GBP' ? 'selected' : ''}>GBP</option>
                            </select>
                        </td>
                        <td><input type="text" class="bulk-input moq-input" data-index="${globalIndex}" value="${currentMOQ}" style="width: 75px; font-size: 11px;"></td>
                        <td><input type="text" class="bulk-input mov-input" data-index="${globalIndex}" value="${currentMOV}" style="width: 75px; font-size: 11px;"></td>
                        <td><input type="text" class="bulk-input quote-input" data-index="${globalIndex}" value="${currentQuoteNumber}" style="width: 115px; font-size: 11px;"></td>
                        <td><input type="text" class="bulk-input leadtime-input" data-index="${globalIndex}" value="${currentLeadTime}" style="width: 95px; font-size: 11px;"></td>
                        <td><input type="number" step="0.01" class="bulk-input shipping-input" data-index="${globalIndex}" value="${currentShipping}" style="width: 75px; font-size: 11px;"></td>
                        <td style="text-align: center;"><input type="checkbox" class="bulk-main-checkbox" data-index="${globalIndex}" ${isMain ? 'checked' : ''}></td>
                    </tr>
                `;
            });
            tbody.innerHTML = rowsHtml;

            if (!tbody.dataset.eventsAttached) {
                tbody.addEventListener('input', (e) => {
                    if (e.target.classList.contains('bulk-input') || e.target.classList.contains('bulk-main-checkbox')) {
                        getEl('btn-save-bulk-prices').disabled = false;
                    }
                });
                tbody.dataset.eventsAttached = 'true';
            }

            const selectAll = getEl('bulk-select-all');
            if (selectAll) {
                selectAll.onclick = () => {
                    const checkboxes = tbody.querySelectorAll('.bulk-row-checkbox');
                    checkboxes.forEach(cb => cb.checked = selectAll.checked);
                };
            }

            renderPaginationControls(filteredItems.length, supplierName);
        }

        function renderBulkToolbar(supplierName, totalItems) {
            let toolbar = getEl('bulk-toolbar');
            if (!toolbar) {
                toolbar = document.createElement('div');
                toolbar.id = 'bulk-toolbar';
                toolbar.style.cssText = 'padding: 10px 20px; background: #fafafa; border-bottom: 1px solid #eee; display: flex; gap: 10px; align-items: center; justify-content: space-between;';
                const wrapper = getEl('bulk-pricing-table-wrapper');
                wrapper.parentNode.insertBefore(toolbar, wrapper);
            }

            
            toolbar.innerHTML = `
                <div style="display: flex; gap: 10px; align-items: center; flex: 1; flex-wrap: wrap;">
                    <span style="font-weight: 600; color: #333;">Filter:</span>
                    <input type="text" id="bulk-filter-part" class="macos-input" placeholder="Part No / Drawing No / MPN" value="${bulkPricingFilterPart}" style="width: 220px;">
                    <input type="text" id="bulk-filter-mfr" class="macos-input" placeholder="Manufacturer" value="${bulkPricingFilterMfr}" style="width: 200px;">
                    <input type="text" id="bulk-filter-desc" class="macos-input" placeholder="Description" value="${bulkPricingFilterDesc}" style="width: 240px;">
                    <input type="text" id="bulk-filter-any" class="macos-input" placeholder="Any (optional)" value="${bulkPricingFilterText}" style="width: 180px;">
                    ${(bulkPricingFilterPart || bulkPricingFilterMfr || bulkPricingFilterDesc || bulkPricingFilterText) ? `<button id="btn-clear-bulk-filter" class="macos-btn" style="padding: 4px 8px; font-size: 11px;">Clear</button>` : ''}
                    <span style="font-size: 12px; color: #666; margin-left: 10px;">Found: <b>${totalItems}</b> items</span>
                </div>
            `;

            const partInput = getEl('bulk-filter-part');
            const mfrInput = getEl('bulk-filter-mfr');
            const descInput = getEl('bulk-filter-desc');
            const anyInput = getEl('bulk-filter-any');

            const applyFilters = () => {
                saveBulkPageToMemory();
                populateBulkPricingTable(supplierName, 1);
            };

            if (partInput) {
                partInput.oninput = (e) => {
                    bulkPricingFilterPart = e.target.value;
                    applyFilters();
                };
            }
            if (mfrInput) {
                mfrInput.oninput = (e) => {
                    bulkPricingFilterMfr = e.target.value;
                    applyFilters();
                };
            }
            if (descInput) {
                descInput.oninput = (e) => {
                    bulkPricingFilterDesc = e.target.value;
                    applyFilters();
                };
            }
            if (anyInput) {
                anyInput.oninput = (e) => {
                    bulkPricingFilterText = e.target.value;
                    applyFilters();
                };
            }

            const btnClear = getEl('btn-clear-bulk-filter');
            if (btnClear) {
                btnClear.onclick = () => {
                    saveBulkPageToMemory();
                    bulkPricingFilterText = '';
                    bulkPricingFilterPart = '';
                    bulkPricingFilterMfr = '';
                    bulkPricingFilterDesc = '';
                    populateBulkPricingTable(supplierName, 1);
                };
            }
        }

        function renderPaginationControls(totalItems, supplierName) {
            let controls = getEl('bulk-pagination');
            if (!controls) {
                controls = document.createElement('div');
                controls.id = 'bulk-pagination';
                controls.className = 'pagination-controls';
                const wrapper = getEl('bulk-pricing-table-wrapper');
                wrapper.parentNode.insertBefore(controls, wrapper.nextSibling);
            }

            const totalPages = Math.ceil(totalItems / bulkItemsPerPage) || 1;

            controls.innerHTML = `
                <div style="display: flex; align-items: center; gap: 5px;">
                    <button id="btn-first-page" class="page-btn" title="First Page" ${bulkCurrentPage === 1 ? 'disabled' : ''}>&lt;&lt;</button>
                    <button id="btn-prev-page" class="page-btn" title="Previous Page" ${bulkCurrentPage === 1 ? 'disabled' : ''}>&lt; Prev</button>
                </div>
                
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="page-info">Page ${bulkCurrentPage} of ${totalPages}</span>
                    <select id="bulk-page-select" class="macos-select" style="padding: 2px 6px; font-size: 11px;">
                         ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `<option value="${p}" ${p === bulkCurrentPage ? 'selected' : ''}>${p}</option>`).join('')}
                    </select>
                </div>
                
                <div style="display: flex; align-items: center; gap: 5px;">
                    <button id="btn-next-page" class="page-btn" title="Next Page" ${bulkCurrentPage === totalPages ? 'disabled' : ''}>Next &gt;</button>
                    <button id="btn-last-page" class="page-btn" title="Last Page" ${bulkCurrentPage === totalPages ? 'disabled' : ''}>&gt;&gt;</button>
                </div>
             `;

            const handlePageChange = (newPage) => {
                if (newPage >= 1 && newPage <= totalPages) {
                    saveBulkPageToMemory();
                    populateBulkPricingTable(supplierName, newPage);
                }
            };

            getEl('btn-first-page').onclick = () => handlePageChange(1);
            getEl('btn-prev-page').onclick = () => handlePageChange(bulkCurrentPage - 1);
            getEl('btn-next-page').onclick = () => handlePageChange(bulkCurrentPage + 1);
            getEl('btn-last-page').onclick = () => handlePageChange(totalPages);

            getEl('bulk-page-select').onchange = (e) => handlePageChange(parseInt(e.target.value));
        }

        function saveBulkPrices() {
            saveBulkPageToMemory();
            // Note: updateProject() is already called inside saveBulkPageToMemory()

            // Explicit re-renders to ensure data propagates to all views
            try { renderCompactTable(); } catch(e) {}
            try { updateStats(); } catch(e) {}
            try { renderDashboard(); } catch(e) {}

            getEl('btn-save-bulk-prices').disabled = true;
            alert('All changes saved successfully!');
        }


// Bulk Supplier Pricing – Import Quote (Excel/CSV)
function bulkNormKey(v){
    return String(v ?? '').trim().toUpperCase();
}
function bulkItemDrawingNo(item){
    return String(item?.item_drawing_no || item?.drawing_no || item?.part_no || item?.part_number || item?.line || item?.mpn || '').trim();
}
function bulkFindItemByDrawingNo(dn){
    const key = bulkNormKey(dn);
    if (!key) return null;
    const items = (currentProject && Array.isArray(currentProject.items)) ? currentProject.items : [];
    for (const it of items){
        const cand = bulkNormKey(bulkItemDrawingNo(it));
        if (cand && cand === key) return it;
    }
    return null;
}
function bulkEnsureSupplierEntry(item, supplierName){
    if (!item.suppliers || !Array.isArray(item.suppliers)) item.suppliers = [];
    let s = item.suppliers.find(x => String(x.name||'').trim() === String(supplierName||'').trim());
    if (!s){
        s = { name: String(supplierName||'').trim(), prices: [], currency: 'EUR', quote_status: '', isMain: false };
        item.suppliers.push(s);
    }
    if (!Array.isArray(s.prices)) s.prices = [];
    return s;
}
function bulkUpsertPrice(entry, qty, price){
    const q = Number(qty);
    const p = Number(price);
    if (!Number.isFinite(q) || q <= 0) return false;
    if (!Number.isFinite(p)) return false;
    const arr = entry.prices || (entry.prices = []);
    const idx = arr.findIndex(x => Number(x.qty) === q);
    if (idx >= 0) arr[idx] = { qty: q, price: p };
    else arr.push({ qty: q, price: p });
    return true;
}
function bulkApplyImportedRows(supplierName, rows){
    if (!currentProject || !Array.isArray(currentProject.items)) return { updated: 0, skipped: 0 };
    const sup = String(supplierName||'').trim();
    if (!sup) return { updated: 0, skipped: 0 };

    let updated = 0;
    let skipped = 0;

    (rows || []).forEach(r => {
        const dn = r.DrawingNo || r['Drawing No'] || r.Drawing || r.PartNo || r['Part No'] || r.MPN || r.mpn || r.item_drawing_no || r.drawing_no || r.part_no || r.part_number;
        const item = bulkFindItemByDrawingNo(dn);
        if (!item) { skipped++; return; }

        const entry = bulkEnsureSupplierEntry(item, sup);

        const currency = r.Currency || r.currency || entry.currency || item.currency || 'EUR';
        entry.currency = String(currency || 'EUR').trim().toUpperCase() || 'EUR';

        if (r.Incoterms || r.incoterms) entry.incoterms = String(r.Incoterms || r.incoterms).trim();
        if (r.LeadTime || r['Lead Time'] || r.lead_time) entry.lead_time = String(r.LeadTime || r['Lead Time'] || r.lead_time).trim();
        if (r.MOQ || r.moq) entry.moq = String(r.MOQ || r.moq).trim();
        if (r.MOV || r.mov) entry.mov = String(r.MOV || r.mov).trim();
        if (r.ValidUntil || r['Valid Until'] || r.valid_until) entry.valid_until = String(r.ValidUntil || r['Valid Until'] || r.valid_until).trim();
        if (r.QuoteNumber || r['Quote #'] || r.quote_number) entry.quote_number = String(r.QuoteNumber || r['Quote #'] || r.quote_number).trim();
        if (r.Notes || r.notes) entry.notes = String(r.Notes || r.notes).trim();

        // gather qty tiers from item
        const tiers = [
            Number(item.qty_1) || 0,
            Number(item.qty_2) || 0,
            Number(item.qty_3) || 0,
            Number(item.qty_4) || 0,
            Number(item.qty_5) || 0,
        ].filter(x => x > 0);

        // read up to 10 qty/price pairs from row
        let anyPrice = false;
        for (let i=1; i<=10; i++){
            const qv = r['Qty_'+i] ?? r['QTY_'+i] ?? r['qty_'+i] ?? r['Qty ' + i] ?? r['Q' + i] ?? r['qty' + i];
            const pv = r['Price_'+i] ?? r['PRICE_'+i] ?? r['price_'+i] ?? r['Price ' + i] ?? r['P' + i] ?? r['price' + i];
            const q = Number(String(qv ?? '').replace(',', '.'));
            const p = Number(String(pv ?? '').replace(',', '.'));
            if (!Number.isFinite(p) || String(pv ?? '').trim() === '') continue;

            // if qty present, match by qty; else by item tier index
            if (Number.isFinite(q) && q > 0){
                bulkUpsertPrice(entry, q, p);
                anyPrice = true;
            } else {
                const tierQty = tiers[i-1];
                if (tierQty) {
                    bulkUpsertPrice(entry, tierQty, p);
                    anyPrice = true;
                }
            }
        }

        // Fallback: if template provides Price@QTY1..5 without Qty columns
        for (let i=1; i<=5; i++){
            const pv = r['Price @QTY'+i] ?? r['Price@QTY'+i] ?? r['Price_QTY'+i] ?? r['PriceQ'+i];
            const p = Number(String(pv ?? '').replace(',', '.'));
            if (!Number.isFinite(p) || String(pv ?? '').trim() === '') continue;
            const tierQty = tiers[i-1];
            if (tierQty) { bulkUpsertPrice(entry, tierQty, p); anyPrice = true; }
        }

        // status
        const st = String(r.Status || r.status || '').trim();
        if (st) entry.quote_status = st;
        else if (anyPrice) entry.quote_status = 'Quoted';

        updated++;
    });

    // persist
    try { updateProject(currentProject); } catch(e){ console.error(e); }

    return { updated, skipped };
}


        
        function renderGlobalSupplierList() {
            try {
                if (!Array.isArray(projects)) return;

                const table = getEl('table-supplier-list');
                const listContent = table ? table.querySelector('tbody') : null;
                if (!listContent) return;

                const searchEl = getEl('supplier-list-search');
                const term = String(searchEl ? searchEl.value : '').trim().toLowerCase();
                const mfrEl = getEl('supplier-list-mfr');
                const partEl = getEl('supplier-list-part');
                const termMfr = String(mfrEl ? mfrEl.value : '').trim().toLowerCase();
                const termPart = String(partEl ? partEl.value : '').trim().toLowerCase();

                const rates = (window.RFQData && window.RFQData.CURRENCY_RATES && typeof window.RFQData.CURRENCY_RATES === 'object')
                    ? window.RFQData.CURRENCY_RATES
                    : { EUR: 1 };

                const supplierMap = new Map(); // key: normalized name

                const norm = (v) => String(v ?? '').trim().toLowerCase();
                const safeCurrency = (v) => {
                    const c = String(v || '').trim().toUpperCase();
                    // protect against bad legacy data where incoterms was stored in currency field
                    if (!c) return 'EUR';
                    if (rates[c]) return c;
                    // common incoterms accidentally placed in currency
                    if (window.RFQData && Array.isArray(window.RFQData.INCOTERMS) && window.RFQData.INCOTERMS.includes(c)) return 'EUR';
                    return rates[c] ? c : 'EUR';
                };

                const ensureRec = (name) => {
                    const display = String(name ?? '').trim();
                    if (!display) return null;
                    const key = norm(display);
                    if (!key) return null;
                    if (!supplierMap.has(key)) {
                        supplierMap.set(key, {
                            name: display,
                            projectIds: new Set(),
                            itemCount: 0,
                            totalValue: 0,
                            rating: 0,
                            status: 'Active',
                            pipeline: '',
                            _itemKeys: new Set(),
                            _searchTokens: new Set(),
                            _itemSearch: '',
                        });
                    }
                    const rec = supplierMap.get(key);
                    if (!rec.name) rec.name = display;
                    return rec;
                };

                const addSupplierOnly = (proj, name, meta) => {
                    const rec = ensureRec(name);
                    if (!rec) return;
                    rec.projectIds.add(String(proj && proj.id || ''));
                    if (meta && typeof meta === 'object') {
                        if (meta.pipeline && !rec.pipeline) rec.pipeline = String(meta.pipeline);
                        const r = Number(meta.rating || 0) || 0;
                        if (r > rec.rating) rec.rating = r;
                        if (meta.status && !rec.status) rec.status = String(meta.status);
                    }
                };

                const addSupplierFromItem = (proj, item, name, supRec) => {
                    const rec = ensureRec(name);
                    if (!rec) return;
                    rec.projectIds.add(String(proj && proj.id || ''));

                    const dn = String(item?.item_drawing_no || item?.drawing_no || '').trim() || String(item?.line || '').trim();
                    const uniqKey = `${proj.id}|${dn || (item && item._id) || ''}`;
                    if (rec._itemKeys.has(uniqKey)) return;
                    rec._itemKeys.add(uniqKey);

                    rec.itemCount += 1;
                    // tokens for cross-filtering (manufacturer / part / drawing / description)
                    const mfrTok = String(item?.manufacturer || '').trim();
                    const mpnTok = String(item?.mpn || item?.MPN || item?.manufacturer_part_no || item?.mfr_part_no || item?.part_no || item?.item_mpn || item?.manufacturer_partnumber || '').trim();
                    const descTok = String(item?.description || '').trim();
                    [dn, mfrTok, mpnTok, descTok].forEach(tok => {
                        const t = String(tok || '').trim();
                        if (!t) return;
                        if (rec._searchTokens && typeof rec._searchTokens.add === 'function') {
                            rec._searchTokens.add(t.toLowerCase());
                        }
                    });


                    const qty1 = parseFloat(String(item?.qty_1 ?? '').replace(',', '.')) || 0;

                    // price preference: supplier-specific price_1, otherwise legacy item price_1
                    const pRaw = (supRec && (supRec.price_1 ?? supRec.price)) ?? item?.price_1 ?? item?.price ?? item?.price_1_euro ?? 0;
                    const p = parseFloat(String(pRaw ?? '').replace(',', '.'));
                    const price = Number.isFinite(p) ? p : 0;

                    const currency = safeCurrency((supRec && supRec.currency) ? supRec.currency : (item?.currency || 'EUR'));
                    const rate = Number(rates[currency] ?? 1) || 1;

                    const value = qty1 * price * rate;
                    if (Number.isFinite(value)) rec.totalValue += value;
                };

                const resolveSupplierNameFromItemSup = (proj, s) => {
                    if (!s || typeof s !== 'object') return '';
                    const direct = String(s.name || s.supplier_name || s.supplier || '').trim();
                    if (direct) return direct;
                    if (s.master_id) {
                        const m = getSupplierMasterById(proj, s.master_id);
                        if (m && m.name) return String(m.name).trim();
                    }
                    if (s.supplier_id) {
                        const m = getSupplierMasterById(proj, s.supplier_id);
                        if (m && m.name) return String(m.name).trim();
                    }
                    return '';
                };

                const hasSupplierInProject = (proj, supplierName) => {
                    const nn = norm(supplierName);
                    if (!nn) return false;

                    // supplierMaster
                    if (Array.isArray(proj.supplierMaster) && proj.supplierMaster.some(sm => norm(sm && sm.name) === nn)) return true;

                    // supplierData legacy
                    if (proj.supplierData && typeof proj.supplierData === 'object') {
                        const keys = Object.keys(proj.supplierData || {});
                        if (keys.some(k => norm(k) === nn)) return true;
                    }

                    // items
                    if (Array.isArray(proj.items)) {
                        for (const it of proj.items) {
                            if (norm(it && it.supplier) === nn) return true;
                            if (Array.isArray(it && it.suppliers)) {
                                for (const s of it.suppliers) {
                                    const nm = resolveSupplierNameFromItemSup(proj, s);
                                    if (norm(nm) === nn) return true;
                                }
                            }
                        }
                    }

                    // bundles
                    const batches = getProjectBatches(proj);
                    if (Array.isArray(batches) && batches.some(b => norm(b && (b.supplier_name || b.supplier)) === nn)) return true;

                    return false;
                };

                // Build map across all projects
                projects.forEach(p => {
                    if (!p || typeof p !== 'object') return;
                    try { ensureProjectSuppliers(p); } catch (e) {}

                    // Supplier Master DB
                    if (Array.isArray(p.supplierMaster)) {
                        p.supplierMaster.forEach(sm => {
                            const nm = String(sm?.name || '').trim();
                            if (!nm) return;
                            addSupplierOnly(p, nm, { rating: sm?.rating, pipeline: sm?.pipeline, status: 'Active' });
                        });
                    }

                    // Legacy supplierData bucket
                    if (p.supplierData && typeof p.supplierData === 'object') {
                        Object.keys(p.supplierData || {}).forEach(k => {
                            const nm = String(k || '').trim();
                            if (!nm) return;
                            addSupplierOnly(p, nm, { status: 'Active' });
                        });
                    }

                    // Bundles supplier names
                    getProjectBatches(p).forEach(b => {
                        const nm = String(b && (b.supplier_name || b.supplier) || '').trim();
                        if (!nm) return;
                        addSupplierOnly(p, nm, { status: 'Active' });
                    });

                    // From items
                    const items = Array.isArray(p.items) ? p.items : [];
                    items.forEach(it => {
                        if (!it) return;

                        // Main supplier legacy
                        const main = String(it.supplier || '').trim();
                        if (main) {
                            const supRec = Array.isArray(it.suppliers) ? it.suppliers.find(s => norm(resolveSupplierNameFromItemSup(p, s) || (s && s.name)) === norm(main)) : null;
                            addSupplierFromItem(p, it, main, supRec);
                        }

                        // Targeted suppliers list
                        if (Array.isArray(it.suppliers)) {
                            it.suppliers.forEach(s => {
                                const nm = resolveSupplierNameFromItemSup(p, s);
                                if (!nm) return;
                                addSupplierFromItem(p, it, nm, s);
                            });
                        }
                    });
                });

                let supplierArray = Array.from(supplierMap.values());

                // finalize search text (for manufacturer/part filters)
                supplierArray.forEach(s => {
                    try {
                        if (!s) return;
                        if (!s._itemSearch) {
                            const toks = (s._searchTokens && typeof s._searchTokens.forEach === 'function') ? Array.from(s._searchTokens) : [];
                            s._itemSearch = toks.join(' ');
                        }
                    } catch (e) {}
                });


                // search
                if (term) supplierArray = supplierArray.filter(s => String(s.name || '').toLowerCase().includes(term));

                if (termMfr) supplierArray = supplierArray.filter(s => String(s._itemSearch || '').toLowerCase().includes(termMfr));
                if (termPart) supplierArray = supplierArray.filter(s => String(s._itemSearch || '').toLowerCase().includes(termPart));

                // sorting
                const sort = window.currentSupplierSort;
                if (sort && sort.field) {
                    const field = sort.field;
                    const dir = sort.dir === 'desc' ? 'desc' : 'asc';
                    supplierArray.sort((a, b) => {
                        let A, B;
                        if (field === 'projects') { A = a.projectIds.size; B = b.projectIds.size; }
                        else if (field === 'items') { A = a.itemCount; B = b.itemCount; }
                        else if (field === 'value') { A = a.totalValue; B = b.totalValue; }
                        else if (field === 'status') { A = String(a.status || ''); B = String(b.status || ''); }
                        else { A = String(a.name || '').toLowerCase(); B = String(b.name || '').toLowerCase(); }
                        if (A < B) return dir === 'asc' ? -1 : 1;
                        if (A > B) return dir === 'asc' ? 1 : -1;
                        return 0;
                    });
                } else {
                    supplierArray.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
                }

                if (!supplierArray.length) {
                    listContent.innerHTML = `<tr><td colspan="6" style="padding:18px; color:#777;">No suppliers found.</td></tr>`;
                    return;
                }

                listContent.innerHTML = supplierArray.map(s => `
                    <tr>
                        <td>
                            <b class="sl-supplier-link" style="color:#007AFF; cursor:pointer; text-decoration:underline;">${escapeHtml(String(s.name || ''))}</b>
                            ${s.rating > 0 ? `<span style="margin-left:6px; color:#FFD700;">${'★'.repeat(Math.min(5, Math.max(1, Math.ceil(s.rating))))}</span>` : ''}
                        </td>
                        <td>
                            <span style="padding:2px 8px; border-radius:10px; font-size:11px; background:#e6ffeb; color:#34C759;">
                                ${escapeHtml(String(s.status || 'Active'))}
                            </span>
                        </td>
                        <td>${s.projectIds.size}</td>
                        <td>${s.itemCount}</td>
                        <td>€${Number(s.totalValue || 0).toFixed(2)}</td>
                        <td><button class="btn-secondary btn-open-supplier-detail" data-supplier="${escapeAttr(String(s.name || ''))}">Open</button></td>
                    </tr>
                `).join('');

                // bind clicks once
                if (!listContent.dataset.boundDetail) {
                    listContent.dataset.boundDetail = '1';
                    listContent.addEventListener('click', (e) => {
                        const btn = e.target.closest('.btn-open-supplier-detail');
                        const link = e.target.closest('.sl-supplier-link');
                        if (!btn && !link) return;

                        const row = e.target.closest('tr');
                        if (!row) return;
                        const name = btn ? btn.dataset.supplier : (row.querySelector('.sl-supplier-link') ? row.querySelector('.sl-supplier-link').textContent : '');
                        const supName = String(name || '').trim();
                        if (!supName) return;

                        // If no currentProject selected, pick a project where the supplier exists
                        if (!currentProject) {
                            const proj = (projects || []).find(p => p && hasSupplierInProject(p, supName));
                            if (proj) openProject(proj);
                        }

                        if (typeof window.openSupplierDetail === 'function') window.openSupplierDetail(supName);
                        e.preventDefault();
                        e.stopPropagation();
                    });
                }
            } catch (e) {
                console.error(e);
                const table = getEl('table-supplier-list');
                const listContent = table ? table.querySelector('tbody') : null;
                if (listContent) {
                    listContent.innerHTML = `<tr><td colspan="6" style="padding:18px; color:#b00;">Supplier list error: ${escapeHtml(e && e.message ? e.message : String(e))}</td></tr>`;
                }
            }
        }



        // =========================================================
        // Project Supplier List (Current project only)
        // =========================================================
        function renderProjectSupplierList() {
            const tbl = getEl('table-proj-suppliers');
            const tbody = tbl ? tbl.querySelector('tbody') : null;
            if (!tbody) return;

            if (!currentProject || !Array.isArray(currentProject.items)) {
                tbody.innerHTML = `<tr><td colspan="7" style="padding:18px; color:#777;">Select a project first.</td></tr>`;
                return;
            }

            const term = String((getEl('proj-sup-search') && getEl('proj-sup-search').value) || '').trim().toLowerCase();
            const termMfr = String((getEl('proj-sup-mfr') && getEl('proj-sup-mfr').value) || '').trim().toLowerCase();
            const termPart = String((getEl('proj-sup-part') && getEl('proj-sup-part').value) || '').trim().toLowerCase();

            const norm = (v) => String(v ?? '').trim().toLowerCase();

            const supplierMap = new Map();

            const ensure = (name) => {
                const display = String(name || '').trim();
                if (!display) return null;
                const key = norm(display);
                if (!key) return null;
                if (!supplierMap.has(key)) {
                    supplierMap.set(key, {
                        name: display,
                        items: new Set(),
                        mainItems: new Set(),
                        quotedItems: new Set(),
                        openRfqs: 0,
                        _tokens: new Set(),
                    });
                }
                const rec = supplierMap.get(key);
                if (!rec.name) rec.name = display;
                return rec;
            };

            const safeNum = (v) => {
                const n = parseFloat(String(v ?? '').replace(',', '.'));
                return Number.isFinite(n) ? n : 0;
            };

            const batches = getProjectBatches(currentProject) || [];
            const openBySupplier = new Map();
            (Array.isArray(batches) ? batches : []).forEach(b => {
                const st = String(b && b.status || '').trim();
                const closed = /closed|won|lost/i.test(st);
                if (closed) return;
                const sn = String((b && (b.supplier_name || b.supplier)) || '').trim();
                if (!sn) return;
                const k = norm(sn);
                openBySupplier.set(k, (openBySupplier.get(k) || 0) + 1);
            });

            currentProject.items.forEach(it => {
                if (!it) return;
                const dn = String(it.item_drawing_no || it.drawing_no || it.line || '').trim();
                const mfr = String(it.manufacturer || '').trim();
                const mpn = String(it.mpn || it.MPN || it.manufacturer_part_no || it.mfr_part_no || it.part_no || it.item_mpn || '').trim();
                const desc = String(it.description || '').trim();

                const suppliers = Array.isArray(it.suppliers) ? it.suppliers : [];
                suppliers.forEach(s => {
                    const nm = String(s && (s.name || s.supplier_name || s.supplier) || '').trim();
                    if (!nm) return;
                    const rec = ensure(nm);
                    if (!rec) return;
                    if (dn) rec.items.add(dn);

                    [dn, mfr, mpn, desc].forEach(t => { const x = String(t||'').trim().toLowerCase(); if (x) rec._tokens.add(x); });

                    const isMain = !!(s.isMain || (String(it.supplier||'').trim() && norm(it.supplier) === norm(nm)));
                    if (isMain && dn) rec.mainItems.add(dn);

                    const hasQuote = safeNum(s.price_1 ?? s.price) > 0 || safeNum(s.price_2) > 0 || safeNum(s.price_3) > 0;
                    if (hasQuote && dn) rec.quotedItems.add(dn);
                });
            });

            // Attach open RFQ counts
            supplierMap.forEach((rec, key) => {
                rec.openRfqs = openBySupplier.get(key) || 0;
            });

            let arr = Array.from(supplierMap.values());

            // Filters
            if (term) arr = arr.filter(r => norm(r.name).includes(term));
            if (termMfr) arr = arr.filter(r => Array.from(r._tokens).some(t => t.includes(termMfr)));
            if (termPart) arr = arr.filter(r => Array.from(r._tokens).some(t => t.includes(termPart)));

            // Sort: open RFQs desc, then items desc
            arr.sort((a,b) => (b.openRfqs - a.openRfqs) || (b.items.size - a.items.size) || String(a.name).localeCompare(String(b.name)));

            if (!arr.length) {
                tbody.innerHTML = `<tr><td colspan="7" style="padding:18px; color:#777;">No suppliers found in this project.</td></tr>`;
                return;
            }

            const suggestionFor = (name, rec) => {
                const out = [];
                try {
                    const sd = (typeof getSupplierData === 'function') ? getSupplierData(name) : null;
                    const email = sd && sd.contact ? String(sd.contact.email || '').trim() : '';
                    if (!email) out.push('Missing email');
                } catch (e) {}
                if ((rec.quotedItems.size || 0) === 0) out.push('No quote yet');
                if ((rec.openRfqs || 0) === 0) out.push('No active RFQ');
                if ((rec.mainItems.size || 0) === 0) out.push('Not set as main');
                return out.slice(0, 3).join(' • ');
            };

            tbody.innerHTML = arr.map(r => {
                const sugg = suggestionFor(r.name, r);
                return `
                    <tr>
                        <td><b class="proj-sup-link" style="color:#007AFF; cursor:pointer; text-decoration:underline;">${escapeHtml(String(r.name))}</b></td>
                        <td>${r.items.size}</td>
                        <td>${r.mainItems.size}</td>
                        <td>${r.quotedItems.size}</td>
                        <td>${r.openRfqs}</td>
                        <td style="font-size:12px; color:#666;">${escapeHtml(String(sugg || ''))}</td>
                        <td><button class="btn-secondary btn-open-proj-sup" data-supplier="${escapeAttr(String(r.name))}">Open</button></td>
                    </tr>
                `;
            }).join('');

            if (!tbody.dataset.bound) {
                tbody.dataset.bound = '1';
                tbody.addEventListener('click', (e) => {
                    const btn = e.target.closest('.btn-open-proj-sup');
                    const link = e.target.closest('.proj-sup-link');
                    if (!btn && !link) return;
                    const row = e.target.closest('tr');
                    if (!row) return;
                    const nameEl = row.querySelector('.proj-sup-link');
                    const supName = btn ? String(btn.dataset.supplier || '').trim() : (nameEl ? String(nameEl.textContent || '').trim() : '');
                    if (!supName) return;
                    if (typeof window.openSupplierDetail === 'function') window.openSupplierDetail(supName);
                    e.preventDefault();
                    e.stopPropagation();
                });
            }

            // Initialize/refresh pagination for project suppliers table
            setTimeout(() => {
                initTablePagination('table-proj-suppliers', { storageKey: 'rfq_proj_suppliers_page' });
            }, 50);
        }

        // Bind project supplier list filters
        (function bindProjectSupplierListUI() {
            const s1 = getEl('proj-sup-search');
            const s2 = getEl('proj-sup-mfr');
            const s3 = getEl('proj-sup-part');
            const br = getEl('btn-proj-sup-refresh');
            if (s1 && !s1.dataset.bound) { s1.dataset.bound='1'; s1.addEventListener('input', renderProjectSupplierList); }
            if (s2 && !s2.dataset.bound) { s2.dataset.bound='1'; s2.addEventListener('input', renderProjectSupplierList); }
            if (s3 && !s3.dataset.bound) { s3.dataset.bound='1'; s3.addEventListener('input', renderProjectSupplierList); }
            if (br && !br.dataset.bound) { br.dataset.bound='1'; br.onclick = () => { try { renderProjectSupplierList(); } catch(e){} }; }
        })();

        // =========================================================
        // Export Center (Server-generated XLSX/PDF/CSV)
        // =========================================================
        function renderExportCenter() {
            const scopeSel = getEl('export-scope');
            const pickerRow = getEl('export-projects-picker-row');
            const picker = getEl('export-projects-picker');
            const status = getEl('export-status');
            const btn = getEl('btn-export-generate');

            if (!scopeSel || !pickerRow || !picker || !btn) return;

            const all = Array.isArray(projects) ? projects : [];
            const makePicker = () => {
                picker.innerHTML = all.map(p => `
                    <label class="export-proj-chip">
                        <input type="checkbox" class="export-proj-check" value="${escapeAttr(String(p.id))}">
                        <span>${escapeHtml(String(p.name || 'Untitled'))}</span>
                    </label>
                `).join('');
            };

            if (!picker.dataset.built) {
                picker.dataset.built = '1';
                makePicker();
            }

            const updateScopeUI = () => {
                const v = String(scopeSel.value || 'current');
                pickerRow.style.display = (v === 'selected') ? '' : 'none';
            };

            if (!scopeSel.dataset.bound) {
                scopeSel.dataset.bound='1';
                scopeSel.addEventListener('change', updateScopeUI);
            }
            updateScopeUI();

            const downloadBlob = (blob, filename) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            };

            const gatherOptions = () => {
                const scope = String(scopeSel.value || 'current');
                let project_ids = [];
                if (scope === 'current') {
                    if (currentProject && currentProject.id) project_ids = [String(currentProject.id)];
                } else if (scope === 'selected') {
                    project_ids = Array.from(picker.querySelectorAll('input.export-proj-check:checked')).map(x => String(x.value));
                } else {
                    project_ids = all.map(p => String(p.id));
                }

                const format = String((getEl('export-format') && getEl('export-format').value) || 'xlsx');
                return {
                    scope,
                    project_ids,
                    format,
                    include_items: !!(getEl('exp-items') && getEl('exp-items').checked),
                    include_item_suppliers: !!(getEl('exp-item-suppliers') && getEl('exp-item-suppliers').checked),
                    include_price_breaks: !!(getEl('exp-price-breaks') && getEl('exp-price-breaks').checked),
                    include_rfqs: !!(getEl('exp-rfqs') && getEl('exp-rfqs').checked),
                    include_attachments: !!(getEl('exp-attachments') && getEl('exp-attachments').checked),
                    suppliers_mode: String((getEl('export-suppliers-mode') && getEl('export-suppliers-mode').value) || 'all'),
                };
            };

            if (!btn.dataset.bound) {
                btn.dataset.bound='1';
                btn.addEventListener('click', async () => {
                    const opts = gatherOptions();
                    if (!opts.project_ids || opts.project_ids.length === 0) {
                        if (status) status.textContent = 'Select at least one project.';
                        return;
                    }
                    if (status) status.textContent = 'Generating export…';
                    try {
                        const r = await fetch('/api/export', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(opts),
                            credentials: 'same-origin',
                        });
                        if (!r.ok) {
                            const t = await r.text();
                            throw new Error(t || ('HTTP ' + r.status));
                        }
                        const blob = await r.blob();
                        const today = new Date().toISOString().slice(0,10);
                        const ext = opts.format === 'pdf' ? 'pdf' : (opts.format === 'csv' ? 'csv' : 'xlsx');
                        const filename = `RFQ_Export_${today}.${ext}`;
                        downloadBlob(blob, filename);
                        if (status) status.textContent = `Done: ${filename}`;
                    } catch (e) {
                        console.error(e);
                        if (status) status.textContent = 'Export failed: ' + (e && e.message ? e.message : String(e));
                    }
                });
            }

            // Multi-Supplier Import Template Download
            const btnTemplate = getEl('btn-export-multi-supplier-template');
            if (btnTemplate && !btnTemplate.dataset.bound) {
                btnTemplate.dataset.bound = '1';
                btnTemplate.addEventListener('click', () => {
                    if (!window.XLSX) {
                        alert('Excel library not loaded. Please refresh the page.');
                        return;
                    }

                    // Create sample data with current project items if available
                    const sampleRows = [];
                    const items = (currentProject && Array.isArray(currentProject.items)) ? currentProject.items : [];

                    if (items.length > 0) {
                        // Use actual items from current project
                        items.slice(0, 20).forEach(item => {
                            sampleRows.push({
                                'PartNo': item.item_drawing_no || item.drawing_no || '',
                                'Supplier': '',
                                'Qty_1': item.qty_1 || 100,
                                'Price_1': '',
                                'Qty_2': item.qty_2 || 500,
                                'Price_2': '',
                                'Qty_3': item.qty_3 || 1000,
                                'Price_3': '',
                                'Qty_4': item.qty_4 || '',
                                'Price_4': '',
                                'Qty_5': item.qty_5 || '',
                                'Price_5': '',
                                'Currency': 'EUR',
                                'MOQ': '',
                                'MOV': '',
                                'LeadTime': '',
                                'Shipping': '',
                                'Incoterms': '',
                                'QuoteNumber': '',
                                'Main': ''
                            });
                        });
                    } else {
                        // Create empty template with sample structure
                        sampleRows.push({
                            'PartNo': 'SAMPLE-001',
                            'Supplier': 'Supplier A',
                            'Qty_1': 100,
                            'Price_1': 10.50,
                            'Qty_2': 500,
                            'Price_2': 9.00,
                            'Qty_3': 1000,
                            'Price_3': 8.50,
                            'Qty_4': '',
                            'Price_4': '',
                            'Qty_5': '',
                            'Price_5': '',
                            'Currency': 'EUR',
                            'MOQ': 50,
                            'MOV': 500,
                            'LeadTime': '4 weeks',
                            'Shipping': '10.00',
                            'Incoterms': 'DDP',
                            'QuoteNumber': 'Q-2024-001',
                            'Main': 'Yes'
                        });
                        sampleRows.push({
                            'PartNo': 'SAMPLE-001',
                            'Supplier': 'Supplier B',
                            'Qty_1': 100,
                            'Price_1': 11.00,
                            'Qty_2': 500,
                            'Price_2': 9.50,
                            'Qty_3': 1000,
                            'Price_3': 9.00,
                            'Qty_4': '',
                            'Price_4': '',
                            'Qty_5': '',
                            'Price_5': '',
                            'Currency': 'USD',
                            'MOQ': 100,
                            'MOV': 1000,
                            'LeadTime': '6 weeks',
                            'Shipping': '15.00',
                            'Incoterms': 'EXW',
                            'QuoteNumber': 'Q-2024-002',
                            'Main': 'No'
                        });
                    }

                    // Create workbook
                    const ws = window.XLSX.utils.json_to_sheet(sampleRows);
                    const wb = window.XLSX.utils.book_new();
                    window.XLSX.utils.book_append_sheet(wb, ws, 'Multi-Supplier Import');

                    // Add instructions sheet
                    const instructions = [
                        { 'Column': 'PartNo', 'Description': 'Part number / Drawing number to match with existing items' },
                        { 'Column': 'Supplier', 'Description': 'Supplier name (required)' },
                        { 'Column': 'Qty_1 to Qty_10', 'Description': 'Quantity tiers (can use any number of tiers)' },
                        { 'Column': 'Price_1 to Price_10', 'Description': 'Prices corresponding to quantity tiers' },
                        { 'Column': 'Currency', 'Description': 'Currency code (EUR, USD, CZK, etc.)' },
                        { 'Column': 'MOQ', 'Description': 'Minimum Order Quantity' },
                        { 'Column': 'MOV', 'Description': 'Minimum Order Value' },
                        { 'Column': 'LeadTime', 'Description': 'Lead time (e.g., "4 weeks")' },
                        { 'Column': 'Shipping', 'Description': 'Shipping cost' },
                        { 'Column': 'Incoterms', 'Description': 'Incoterms (EXW, DDP, etc.)' },
                        { 'Column': 'QuoteNumber', 'Description': 'Quote reference number' },
                        { 'Column': 'Main', 'Description': 'Set to "Yes" to mark as main supplier' }
                    ];
                    const wsInstr = window.XLSX.utils.json_to_sheet(instructions);
                    window.XLSX.utils.book_append_sheet(wb, wsInstr, 'Instructions');

                    // Download
                    const today = new Date().toISOString().slice(0, 10);
                    const filename = `Multi_Supplier_Import_Template_${today}.xlsx`;
                    window.XLSX.writeFile(wb, filename);
                });
            }
        }


window.sortSupplierList = (field) => {
            if (!window.currentSupplierSort || window.currentSupplierSort.field !== field) {
                window.currentSupplierSort = { field: field, dir: 'asc' };
            } else {
                window.currentSupplierSort.dir = window.currentSupplierSort.dir === 'asc' ? 'desc' : 'asc';
            }
            renderGlobalSupplierList();
        };

        const supplierListSearch = getEl('supplier-list-search');
        if (supplierListSearch) {
            supplierListSearch.addEventListener('input', renderGlobalSupplierList);
            const supplierListMfr = getEl('supplier-list-mfr');
            const supplierListPart = getEl('supplier-list-part');
            if (supplierListMfr) supplierListMfr.addEventListener('input', renderGlobalSupplierList);
            if (supplierListPart) supplierListPart.addEventListener('input', renderGlobalSupplierList);

            // Robust click handling: open Supplier Detail even if inline onclick breaks (quotes/special chars)
            const supTbl = getEl('table-supplier-list');
            if (supTbl) {
                const supTbody = supTbl.querySelector('tbody');
                if (supTbody && !supTbody.dataset.boundDetail) {
                    supTbody.dataset.boundDetail = '1';
                    supTbody.addEventListener('click', (e) => {
                        const row = e.target.closest('tr');
                        if (!row) return;
                        // Only react when clicking the supplier name link or action button
                        const isNameClick = !!e.target.closest('b');
                        const isBtnClick = !!e.target.closest('button');
                        if (!isNameClick && !isBtnClick) return;
                        const nameEl = row.querySelector('td b');
                        const supName = nameEl ? String(nameEl.textContent || '').trim() : '';
                        if (!supName) return;
                        if (typeof window.openSupplierDetail === 'function') window.openSupplierDetail(supName);
                        e.preventDefault();
                        e.stopPropagation();
                    });
                }
            }

        }

        function ensureDatabaseAdvancedFiltersUI() {
            try {
                const view = getEl('view-database');
                if (!view) return;
                const toolbar = view.querySelector('.toolbar');
                if (!toolbar) return;

                // already injected
                if (toolbar.querySelector('#db-supplier-filter')) return;

                const supSel = document.createElement('select');
                supSel.id = 'db-supplier-filter';
                supSel.className = 'filter-select';
                supSel.style.width = '220px';
                supSel.innerHTML = '<option value="">All Suppliers</option>';

                const minProj = document.createElement('input');
                minProj.id = 'db-min-projects';
                minProj.type = 'number';
                minProj.min = '0';
                minProj.placeholder = '#Projects ≥';
                minProj.className = 'filter-input';
                minProj.style.width = '110px';

                const maxProj = document.createElement('input');
                maxProj.id = 'db-max-projects';
                maxProj.type = 'number';
                maxProj.min = '0';
                maxProj.placeholder = '#Projects ≤';
                maxProj.className = 'filter-input';
                maxProj.style.width = '110px';

                const minSup = document.createElement('input');
                minSup.id = 'db-min-suppliers';
                minSup.type = 'number';
                minSup.min = '0';
                minSup.placeholder = '#Suppliers ≥';
                minSup.className = 'filter-input';
                minSup.style.width = '110px';

                const onlyQuotedWrap = document.createElement('label');
                onlyQuotedWrap.style.display = 'inline-flex';
                onlyQuotedWrap.style.alignItems = 'center';
                onlyQuotedWrap.style.gap = '6px';
                onlyQuotedWrap.style.fontSize = '12px';
                onlyQuotedWrap.style.color = '#333';
                onlyQuotedWrap.style.marginLeft = '4px';

                const onlyQuoted = document.createElement('input');
                onlyQuoted.id = 'db-only-quoted';
                onlyQuoted.type = 'checkbox';
                onlyQuoted.style.transform = 'scale(1.1)';
                onlyQuotedWrap.appendChild(onlyQuoted);
                onlyQuotedWrap.appendChild(document.createTextNode('Only quoted'));

                // Insert after the existing project filter if present, otherwise append
                const projFilterEl = getEl('database-project-filter');
                if (projFilterEl && projFilterEl.parentElement === toolbar) {
                    toolbar.insertBefore(supSel, projFilterEl.nextSibling);
                    toolbar.insertBefore(minProj, supSel.nextSibling);
                    toolbar.insertBefore(maxProj, minProj.nextSibling);
                    toolbar.insertBefore(minSup, maxProj.nextSibling);
                    toolbar.insertBefore(onlyQuotedWrap, minSup.nextSibling);
                } else {
                    toolbar.appendChild(supSel);
                    toolbar.appendChild(minProj);
                    toolbar.appendChild(maxProj);
                    toolbar.appendChild(minSup);
                    toolbar.appendChild(onlyQuotedWrap);
                }

                // Bind listeners once
                const bindOnce = (el, ev, fn) => {
                    if (!el) return;
                    const key = 'listener_' + ev;
                    if (el.dataset && el.dataset[key]) return;
                    el.addEventListener(ev, fn);
                    if (el.dataset) el.dataset[key] = '1';
                };

                bindOnce(supSel, 'change', renderDatabase);
                bindOnce(minProj, 'input', renderDatabase);
                bindOnce(maxProj, 'input', renderDatabase);
                bindOnce(minSup, 'input', renderDatabase);
                bindOnce(onlyQuoted, 'change', renderDatabase);
            } catch (e) {
                console.error(e);
            }
        }



// =========================================================
// Database Advanced Search Helpers (MPN-centric)
// Supports token AND + key:value (mpn:, mfr:, manufacturer:, desc:, dn:/drawing:, sup:/supplier:, proj:/project:)
// Returns { free:[], kv:{} } and { ok:boolean, score:number }
// =========================================================
function dbAdvParseQuery(q) {
    const raw = String(q || '').trim();
    if (!raw) return { free: [], kv: {} };
    const parts = raw.split(/\s+/).filter(Boolean);
    const kv = {};
    const free = [];
    parts.forEach(p => {
        const m = String(p || '').match(/^([a-zA-Z_]+):(.*)$/);
        if (m) {
            const k = String(m[1] || '').toLowerCase();
            const v = String(m[2] || '').toLowerCase();
            if (k && v) kv[k] = v;
        } else {
            free.push(String(p).toLowerCase());
        }
    });
    return { free, kv };
}

function dbAdvMatchAndScore(entry, parsed, searchLower) {
    const mpn = String(entry && entry.mpn || '').toLowerCase();
    const mfr = String(entry && entry.manufacturer || '').toLowerCase();
    const desc = String(entry && entry.description || '').toLowerCase();
    const drawings = entry && entry.drawings ? Array.from(entry.drawings).join(' ').toLowerCase() : '';
    const suppliers = entry && entry.suppliers ? Array.from(entry.suppliers).join(' ').toLowerCase() : '';
    const projNames = entry && entry.projects ? entry.projects.map(p => String(p && p.name ? p.name : '')).join(' ').toLowerCase() : '';

    const kv = (parsed && parsed.kv) ? parsed.kv : {};
    const free = (parsed && parsed.free) ? parsed.free : [];

    const hayAll = (mpn + ' ' + mfr + ' ' + desc + ' ' + drawings + ' ' + suppliers + ' ' + projNames).trim();

    const kvMap = {
        mpn,
        mfr,
        manufacturer: mfr,
        desc,
        dn: drawings,
        drawing: drawings,
        sup: suppliers,
        supplier: suppliers,
        proj: projNames,
        project: projNames
    };

    // key:value constraints (AND)
    for (const k in kv) {
        if (!Object.prototype.hasOwnProperty.call(kv, k)) continue;
        const want = String(kv[k] || '').trim();
        if (!want) continue;
        const hay = String(kvMap[k] || '');
        if (!hay.includes(want)) return { ok: false, score: 0 };
    }

    // free tokens (AND)
    for (const t of free) {
        if (t && !hayAll.includes(t)) return { ok: false, score: 0 };
    }

    // scoring: emphasize MPN
    let score = 1;
    const q = String(searchLower || '').trim();
    if (q) {
        if (mpn === q) score += 1000;
        else if (mpn.startsWith(q)) score += 500;
        else if (mpn.includes(q)) score += 250;
        if (suppliers.includes(q)) score += 90;
        if (mfr.includes(q)) score += 80;
        if (desc.includes(q)) score += 50;
        if (drawings.includes(q)) score += 30;
        if (projNames.includes(q)) score += 20;
    }

    // boosts for breadth
    try { score += Math.min(60, (entry && entry.projects ? entry.projects.length : 0) * 3); } catch (e) {}
    try { score += Math.min(60, (entry && entry.suppliers ? entry.suppliers.size : 0) * 3); } catch (e) {}
    try { score += Math.min(40, Number(entry && entry.items_count || 0) * 0.5); } catch (e) {}

    return { ok: true, score };
}

function openProjectAndFindMPN(projectId, mpn) {
            try { openProject(projectId); } catch (e) { console.error(e); return; }
            try { switchView('items'); } catch (e) {}
            try {
                const needle = String(mpn || '').trim().toLowerCase();
                if (!needle || !currentProject || !Array.isArray(currentProject.items)) return;
                const idx = currentProject.items.findIndex(it => {
                    const cand = String(it.mpn || it.MPN || it.part_no || it.part_number || it.item_drawing_no || it.drawing_no || '').trim().toLowerCase();
                    return cand && cand === needle;
                });
                if (idx >= 0) openDetailWindow(idx);
            } catch (e) { console.error(e); }
        }

function renderDatabase() {
            ensureDatabaseAdvancedFiltersUI();

            const tbody = document.querySelector('#table-database tbody');
            if (!tbody) return;

            const rawQuery = databaseSearch ? String(databaseSearch.value || '').trim() : '';
            const searchLower = rawQuery.toLowerCase().trim();

            const projectFilter = databaseProjectFilter ? databaseProjectFilter.value : '';

            const dbSupplierFilterEl = getEl('db-supplier-filter');
            const dbMinProjectsEl = getEl('db-min-projects');
            const dbMaxProjectsEl = getEl('db-max-projects');
            const dbMinSuppliersEl = getEl('db-min-suppliers');
            const dbOnlyQuotedEl = getEl('db-only-quoted');

            const supplierFilter = dbSupplierFilterEl ? String(dbSupplierFilterEl.value || '').trim() : '';
            const minProjects = dbMinProjectsEl && dbMinProjectsEl.value !== '' ? parseInt(dbMinProjectsEl.value, 10) : null;
            const maxProjects = dbMaxProjectsEl && dbMaxProjectsEl.value !== '' ? parseInt(dbMaxProjectsEl.value, 10) : null;
            const minSuppliers = dbMinSuppliersEl && dbMinSuppliersEl.value !== '' ? parseInt(dbMinSuppliersEl.value, 10) : null;
            const onlyQuoted = !!(dbOnlyQuotedEl && dbOnlyQuotedEl.checked);

            if (databaseProjectFilter && databaseProjectFilter.options.length <= 1) {
                projects.forEach(p => {
                    const opt = document.createElement('option');
                    opt.value = p.id;
                    opt.textContent = p.name;
                    databaseProjectFilter.appendChild(opt);
                });
            }

            const all = {};
            const allSuppliers = new Set();

            // Normalize keys for grouping (MPN-centric)
            const _normKey = (v) => String(v || '').trim().toLowerCase().replace(/\s+/g, ' ');
            const _parseNum = (v) => {
                const s = String(v ?? '').trim();
                if (!s) return null;
                const cleaned = s.replace(/\s+/g, '').replace(',', '.').replace(/[^0-9.\-]/g, '');
                const n = Number(cleaned);
                return Number.isFinite(n) ? n : null;
            };


            const getMPN = (item) => {
                const keys = ['mpn','MPN','manufacturer_part_number','manufacturer_part_no','manufacturer_part_num','mfr_part_no','mfr_part_num','mfg_part_number','mfg_pn','part_no','part_number','pn','mpn_number'];
                for (const k of keys) {
                    const v = item ? item[k] : '';
                    const s = String(v ?? '').trim();
                    if (s) return s;
                }
                return '';
            };

            const addSupplierName = (entry, name) => {
                const n = String(name || '').trim();
                if (!n) return;
                entry.suppliers.add(n);
                allSuppliers.add(n);
            };

            projects.forEach(proj => {
                if (!proj || !proj.items) return;
                if (projectFilter && proj.id != projectFilter) return;

                (proj.items || []).forEach((it, itemIdx) => {
                    try { ensureItemShape(it); } catch (e) {}
                    try { syncItemHeaderFromMainSupplier(it, false); } catch (e) {}

                    const mpn = getMPN(it) || 'Unknown MPN';
                    const key = _normKey(mpn);

                    if (!all[key]) {
                        all[key] = {
                            _key: key,
                            mpn,
                            description: it.description || it.desc || it.item_description || '',
                            manufacturer: it.manufacturer || it.mfr || it.brand || '',
                            drawings: new Set(),
                            suppliers: new Set(),
                            prices: [],
                            projects: [],
                            items_count: 0,
                            project_price_map: {},
                            project_item_count: {},
                            project_details: [],
                            refs: []
                        };
                    }

                    const entry = all[key];
                    entry.items_count += 1;

                    const dn = String(it.item_drawing_no || it.drawing_no || it.drawing || it.dn || '').trim();
                    if (dn) {
                        entry.drawings.add(dn);
                    }
                    // Always keep a direct reference so clicking an MPN can open Item Detail even if drawing_no is blank
                    try { entry.refs.push({ projectId: proj.id, projectName: proj.name, index: itemIdx, drawingNo: dn }); } catch(e) {}

                    // Collect suppliers from both legacy and multi-quote structures
                    if (Array.isArray(it.suppliers)) {
                        it.suppliers.forEach(s => {
                            if (!s) return;
                            addSupplierName(entry, s.name || s.supplier || s.vendor || '');
                        });
                    }
                    addSupplierName(entry, it.supplier || it.vendor || '');

                    const p1 = _parseNum(it.price_1_euro);
                    if (p1 !== null) entry.prices.push(p1);

                    // Track prices by project for better cross-project visibility
                    try {
                        const pid = proj.id;
                        if (!entry.project_price_map) entry.project_price_map = {};
                        if (!entry.project_price_map[pid]) entry.project_price_map[pid] = [];
                        if (p1 !== null) entry.project_price_map[pid].push(p1);

                        if (!entry.project_item_count) entry.project_item_count = {};
                        entry.project_item_count[pid] = Number(entry.project_item_count[pid] || 0) + 1;

                        // Store project detail (limited later in UI)
                        if (Array.isArray(entry.project_details)) {
                            entry.project_details.push({
                                project_id: pid,
                                project_name: proj.name,
                                drawing_no: String(it.item_drawing_no || it.drawing_no || it.dn || it.item_no || it.line || '').trim(),
                                price_eur: p1
                            });
                        }
                    } catch (e) {}

                    if (!entry.projects.find(p => p.id === proj.id)) {
                        entry.projects.push({ name: proj.name, id: proj.id });
                    }
                });
            });

            // Populate supplier filter dropdown (preserve selection)
            if (dbSupplierFilterEl) {
                const cur = supplierFilter;
                const opts = Array.from(allSuppliers).sort((a, b) => String(a).localeCompare(String(b)));
                dbSupplierFilterEl.innerHTML = '<option value="">All Suppliers</option>' + opts.map(s => {
                    const esc = escapeHtml(String(s));
                    const sel = (String(s) === String(cur)) ? ' selected' : '';
                    return `<option value="${esc}"${sel}>${esc}</option>`;
                }).join('');
            }

            __dbIndex = all;

            const parsed = dbAdvParseQuery(rawQuery);

            const rows = Object.values(all)
                .map(entry => {
                    const match = dbAdvMatchAndScore(entry, parsed, searchLower);
                    return { entry, ok: match.ok, score: match.score };
                })
                .filter(x => x.ok)
                .filter(x => {
                    const entry = x.entry;
                    if (supplierFilter) {
                        if (!entry.suppliers || !entry.suppliers.has(supplierFilter)) return false;
                    }
                    const pc = entry.projects ? entry.projects.length : 0;
                    const sc = entry.suppliers ? entry.suppliers.size : 0;
                    if (minProjects !== null && Number.isFinite(minProjects) && pc < minProjects) return false;
                    if (maxProjects !== null && Number.isFinite(maxProjects) && pc > maxProjects) return false;
                    if (minSuppliers !== null && Number.isFinite(minSuppliers) && sc < minSuppliers) return false;
                    if (onlyQuoted) {
                        const hasPrice = Array.isArray(entry.prices) && entry.prices.some(v => Number.isFinite(v));
                        if (!hasPrice) return false;
                    }
                    return true;
                })
                .sort((a, b) => (b.score - a.score) || String(a.entry.mpn).localeCompare(String(b.entry.mpn)))
                .map(({ entry }) => {
                    const prices = entry.prices.filter(x => Number.isFinite(x));
                    let priceDisplay = '-';
                    if (prices.length) {
                        const min = Math.min(...prices);
                        const max = Math.max(...prices);
                        priceDisplay = (min === max) ? min.toFixed(2) : `${min.toFixed(2)} - ${max.toFixed(2)}`;
                    }

                    const drawingsTxt = Array.from(entry.drawings).slice(0, 6).join(', ');
                    const drawingsMore = entry.drawings.size > 6 ? ` +${entry.drawings.size - 6}` : '';
                    const drawingsHtml = drawingsTxt ? `<div style="font-size:11px; color:#666; margin-top:3px;">Drawings: ${escapeHtml(drawingsTxt)}${drawingsMore}</div>` : '';

                    const supArr = Array.from(entry.suppliers || []).slice(0, 5);
                    const supMore = (entry.suppliers && entry.suppliers.size > 5) ? ` +${entry.suppliers.size - 5}` : '';
                    const supHtml = supArr.length ? `<div style="font-size:11px; color:#666; margin-top:3px;">Suppliers: ${escapeHtml(supArr.join(', '))}${supMore}</div>` : '';

                    const metaBadges = `
                        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:6px;">
                            <span style="font-size:11px; padding:2px 8px; border:1px solid #e5e5ea; border-radius:999px; background:#fafafa; color:#444;">Projects: <b>${escapeHtml(String(entry.projects ? entry.projects.length : 0))}</b></span>
                            <span style="font-size:11px; padding:2px 8px; border:1px solid #e5e5ea; border-radius:999px; background:#fafafa; color:#444;">Suppliers: <b>${escapeHtml(String(entry.suppliers ? entry.suppliers.size : 0))}</b></span>
                            <span style="font-size:11px; padding:2px 8px; border:1px solid #e5e5ea; border-radius:999px; background:#fafafa; color:#444;">Items: <b>${escapeHtml(String(entry.items_count || 0))}</b></span>
                        </div>
                    `;

                    const projectLinks = entry.projects.map(p => {
                        const pid = p.id;
                        const list = (entry.project_price_map && entry.project_price_map[pid]) ? entry.project_price_map[pid].filter(x => Number.isFinite(x)) : [];
                        const minP = list.length ? Math.min(...list) : null;
                        const cnt = entry.project_item_count && entry.project_item_count[pid] ? Number(entry.project_item_count[pid]) : null;
                        const suffix = (minP !== null && Number.isFinite(minP)) ? ` (€${minP.toFixed(2)}${cnt ? ` / ${cnt}` : ''})` : (cnt ? ` (${cnt})` : '');
                        const label = `${p.name}${suffix}`;
                        return `<button class="btn-text" onclick="window.openProjectAndFindMPN && window.openProjectAndFindMPN('${escapeHtml(String(pid))}', '${escapeHtml(String(entry.mpn))}')"
                                style="text-decoration: underline;">${escapeHtml(label)}</button>`;
                    }).join(', ');

                    return `
                        <tr data-db-key="${escapeAttr(entry._key || '')}">
                            <td style="width: 40px;">
                                <input type="checkbox" class="db-row-checkbox" data-db-key="${escapeAttr(entry._key || '')}" ${selectedDbParts.has(entry._key) ? 'checked' : ''}>
                            </td>
                            <td class="db-open-cell" data-db-key="${escapeAttr(entry._key || '')}" style="cursor:pointer;">
                                <span style="font-weight:800; color:#007AFF;">${escapeHtml(entry.mpn)}</span>${drawingsHtml}${supHtml}${metaBadges}
                            </td>
                            <td>${escapeHtml(entry.description || '-') }</td>
                            <td>${escapeHtml(entry.manufacturer || '-') }</td>
                            <td>${escapeHtml(priceDisplay)}</td>
                            <td>${projectLinks || '-'}</td>
                        </tr>
                    `;
                }).join('');

            tbody.innerHTML = rows || `<tr><td colspan="6" style="padding:14px; text-align:center; color:#888;">No results</td></tr>`;
            try { updateDbSelectionUI(); } catch(e) {}

            // Initialize/refresh pagination for database table
            setTimeout(() => {
                initTablePagination('table-database', { storageKey: 'rfq_database_page' });
            }, 50);
        }
        // =========================================================
        // Database (Global Parts) helpers
        // =========================================================
        function updateDbSelectionUI() {
            const countEl = getEl('db-selected-count');
            const expBtn = getEl('btn-db-export-selected');
            const clrBtn = getEl('btn-db-clear-selection');
            const n = selectedDbParts ? selectedDbParts.size : 0;

            if (countEl) countEl.textContent = `${n} selected`;
            if (expBtn) expBtn.disabled = n === 0;
            if (clrBtn) clrBtn.disabled = n === 0;

            const selAll = getEl('db-select-all');
            if (selAll) {
                const boxes = Array.from(document.querySelectorAll('#table-database tbody .db-row-checkbox'));
                const visible = boxes.filter(b => {
                    const tr = b.closest('tr');
                    return tr && tr.offsetParent !== null;
                });
                const checked = visible.filter(b => b.checked).length;
                selAll.checked = visible.length > 0 && checked === visible.length;
                selAll.indeterminate = checked > 0 && checked < visible.length;
            }
        }

        function openItemDetailByRef(ref) {
            if (!ref) return;
            const proj = projects.find(p => String(p.id) === String(ref.projectId));
            if (!proj) return;

            // Switch current project without changing current view (so Item Detail returns back correctly)
            currentProject = proj;
            try { updateProject(currentProject); } catch (e) {}
            try { setProjectNameUI(proj.name); } catch (e) {}

            let idx = Number.isFinite(ref.index) ? ref.index : -1;
            if (idx < 0) {
                idx = (proj.items || []).findIndex(it => String(it.item_drawing_no || '').trim() === String(ref.drawingNo || '').trim());
            }
            if (idx < 0) {
                alert('Item not found in selected project.');
                return;
            }
            try { openDetailWindow(idx); } catch (e) { try { openItemDetail(idx); } catch (e2) {} }
        }

        function showDatabaseItemPicker(entry, refs) {
            const id = 'db-item-picker';
            let overlay = getEl(id);
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = id;
                overlay.className = 'modal-overlay';
                overlay.style.zIndex = '3000';
                overlay.innerHTML = `
                    <div class="modal-content" style="max-width: 980px; width: 92vw;">
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
                            <h3 style="margin:0;">Open Item Detail</h3>
                            <button class="btn-secondary" id="db-item-picker-close" type="button">Close</button>
                        </div>
                        <div class="muted" style="margin-top:6px;">
                            MPN: <b id="db-item-picker-mpn"></b> • Choose which project instance to open.
                        </div>
                        <div class="table-wrapper sd-table-wrap" style="margin-top:10px;">
                            <table class="rfq-table">
                                <thead>
                                    <tr>
                                        <th>Project</th>
                                        <th>Drawing No.</th>
                                        <th>Description</th>
                                        <th style="width:120px;">Action</th>
                                    </tr>
                                </thead>
                                <tbody id="db-item-picker-body"></tbody>
                            </table>
                        </div>
                    </div>
                `;
                document.body.appendChild(overlay);
            }
            overlay.classList.remove('hidden');

            const mpnEl = getEl('db-item-picker-mpn');
            if (mpnEl) mpnEl.textContent = String(entry && entry.mpn || '');

            const body = getEl('db-item-picker-body');
            if (body) {
                body.innerHTML = (refs || []).map(r => {
                    const proj = projects.find(p => String(p.id) === String(r.projectId));
                    const it = (proj && proj.items && Number.isFinite(r.index)) ? proj.items[r.index] : null;
                    const dn = String(r.drawingNo || (it && it.item_drawing_no) || '').trim();
                    const desc = String((it && it.description) || (entry && entry.description) || '');
                    const enc = escapeAttr(encodeURIComponent(JSON.stringify({ projectId: r.projectId, index: r.index, drawingNo: dn })));
                    return `
                        <tr>
                            <td>${escapeHtml(String((proj && proj.name) || r.projectName || '-'))}</td>
                            <td>${escapeHtml(dn || '-')}</td>
                            <td>${escapeHtml(desc || '-')}</td>
                            <td><button class="btn-primary db-item-open" data-ref="${enc}" type="button">Open</button></td>
                        </tr>
                    `;
                }).join('') || `<tr><td colspan="4" style="padding:14px; text-align:center; color:#888;">No matching items</td></tr>`;
            }

            const closeBtn = getEl('db-item-picker-close');
            if (closeBtn && !closeBtn.dataset.bound) {
                closeBtn.dataset.bound = '1';
                closeBtn.onclick = () => overlay.classList.add('hidden');
            }

            overlay.onclick = (e) => {
                if (e.target === overlay) overlay.classList.add('hidden');
            };

            overlay.querySelectorAll('.db-item-open').forEach(btn => {
                btn.onclick = () => {
                    const refEnc = btn.getAttribute('data-ref') || '';
                    let refObj = null;
                    try { refObj = JSON.parse(decodeURIComponent(refEnc)); } catch (e) {}
                    overlay.classList.add('hidden');
                    if (refObj) openItemDetailByRef(refObj);
                };
            });
        }

        function openDatabaseKey(key) {
            const k = String(key || '').trim().toLowerCase();
            if (!k) return;
            const entry = __dbIndex ? __dbIndex[k] : null;
            if (!entry) return;

            let refs = Array.isArray(entry.refs) ? entry.refs.slice() : [];
            const pf = databaseProjectFilter ? String(databaseProjectFilter.value || '').trim() : '';
            if (pf) {
                const scoped = refs.filter(r => String(r.projectId) === pf);
                if (scoped.length) refs = scoped;
            }

            if (refs.length === 1) {
                openItemDetailByRef(refs[0]);
                return;
            }
            showDatabaseItemPicker(entry, refs);
        }

        function exportDatabaseSelection() {
            const keys = Array.from(selectedDbParts || []);
            if (keys.length === 0) return;

            const rows = keys.map(k => {
                const e = __dbIndex ? __dbIndex[String(k).toLowerCase()] : null;
                if (!e) return null;
                const suppliers = e.suppliers ? Array.from(e.suppliers).join('; ') : '';
                const projectsUsed = Array.isArray(e.projects) ? e.projects.map(p => p.name).join('; ') : '';
                const priceMin = Array.isArray(e.prices) && e.prices.length ? Math.min(...e.prices.filter(x => Number.isFinite(x))) : null;
                const priceMax = Array.isArray(e.prices) && e.prices.length ? Math.max(...e.prices.filter(x => Number.isFinite(x))) : null;
                return {
                    MPN: e.mpn || '',
                    Description: e.description || '',
                    Manufacturer: e.manufacturer || '',
                    ItemsCount: e.items_count || 0,
                    ProjectsCount: e.projects ? e.projects.length : 0,
                    SuppliersCount: e.suppliers ? e.suppliers.size : 0,
                    PriceMin_EUR: (priceMin === null || !isFinite(priceMin)) ? '' : Number(priceMin).toFixed(4),
                    PriceMax_EUR: (priceMax === null || !isFinite(priceMax)) ? '' : Number(priceMax).toFixed(4),
                    Suppliers: suppliers,
                    Projects: projectsUsed
                };
            }).filter(Boolean);

            const filename = `Database_Selected_${new Date().toISOString().slice(0,10)}.xlsx`;

            if (typeof XLSX !== 'undefined' && XLSX && XLSX.utils) {
                const ws = XLSX.utils.json_to_sheet(rows);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Database');
                XLSX.writeFile(wb, filename);
                return;
            }

            // Fallback CSV
            const cols = Object.keys(rows[0] || {});
            const csv = [cols.join(',')].concat(rows.map(r => cols.map(c => {
                const v = String(r[c] ?? '');
                const safe = v.includes(',') || v.includes('\n') || v.includes('"') ? `"${v.replace(/"/g,'""')}"` : v;
                return safe;
            }).join(','))).join('\n');

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename.replace('.xlsx', '.csv');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function renderCharts(items, supplierValues) {
            if (typeof Chart === 'undefined') return;

            // Top Suppliers by Items Chart
            const supplierCounts = {};
            items.forEach(item => {
                const supplier = item.supplier || 'Unknown';
                if (supplier && supplier !== 'Unknown') {
                    supplierCounts[supplier] = (supplierCounts[supplier] || 0) + 1;
                }
            });

            const topSuppliers = Object.entries(supplierCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            const suppliersCtx = getEl('chart-suppliers');
            if (suppliersCtx) {
                if (suppliersChart) suppliersChart.destroy();

                suppliersChart = new Chart(suppliersCtx, {
                    type: 'bar',
                    data: {
                        labels: topSuppliers.map(s => s[0]),
                        datasets: [{
                            label: 'Items',
                            data: topSuppliers.map(s => s[1]),
                            backgroundColor: '#007aff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { beginAtZero: true, ticks: { stepSize: 1 } },
                            x: { ticks: { maxRotation: 45, minRotation: 0 } }
                        }
                    }
                });
            }

            // Value by Supplier Chart
            const supplierValueCtx = getEl('chart-supplier-value');
            if (supplierValueCtx && supplierValues) {
                if (supplierValueChart) supplierValueChart.destroy();

                const topByValue = Object.entries(supplierValues)
                    .filter(([name]) => name && name !== 'Unknown')
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5);

                if (topByValue.length > 0) {
                    supplierValueChart = new Chart(supplierValueCtx, {
                        type: 'bar',
                        data: {
                            labels: topByValue.map(s => s[0]),
                            datasets: [{
                                label: 'Value',
                                data: topByValue.map(s => s[1]),
                                backgroundColor: '#34C759'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function(value) {
                                            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
                                            if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
                                            return value;
                                        }
                                    }
                                },
                                x: { ticks: { maxRotation: 45, minRotation: 0 } }
                            }
                        }
                    });
                }
            }
        }

        function applyFilters() {
            // Legacy filter function - SuperTable now handles filtering
            // This is kept for backwards compatibility but does nothing with SuperTable
            if (itemsSuperTable) {
                // SuperTable has its own column-based filtering
                return;
            }

            // Legacy code for non-SuperTable scenarios
            updateStats();
        }

        function updateStats() {
            if (!currentProject || !currentProject.items) {
                if (statTotal) statTotal.textContent = '0';
                if (statDone) statDone.textContent = '0';
                if (statPending) statPending.textContent = '0';
                return;
            }

            // Use all items for stats
            const items = currentProject.items;
            const total = items.length;
            let done = 0;
            let pending = 0;

            items.forEach(item => {
                const status = item.status || 'New';
                if (status === 'Done') done++;
                else if (status === 'Pending' || status === 'New') pending++;
            });

            if (statTotal) statTotal.textContent = total;
            if (statDone) statDone.textContent = done;
            if (statPending) statPending.textContent = pending;
        }

        function updateSupplierFilter() {
            if (!currentProject || !currentProject.items) return;
            const suppliers = new Set();
            currentProject.items.forEach(item => { if (item.supplier) suppliers.add(item.supplier); });
            const currentValue = filterSupplier.value;
            filterSupplier.innerHTML = '<option value="">All Suppliers</option>';
            Array.from(suppliers).sort().forEach(supplier => {
                const option = document.createElement('option');
                option.value = supplier;
                option.textContent = supplier;
                filterSupplier.appendChild(option);
            });
            filterSupplier.value = currentValue;
        }

        function updateManufacturerFilter() {
            if (!currentProject || !currentProject.items) return;
            const manufacturers = new Set();
            currentProject.items.forEach(item => { if (item.manufacturer) manufacturers.add(item.manufacturer); });
            const currentValue = filterManufacturer.value;
            filterManufacturer.innerHTML = '<option value="">All Manufacturers</option>';
            Array.from(manufacturers).sort().forEach(manufacturer => {
                const option = document.createElement('option');
                option.value = manufacturer;
                option.textContent = manufacturer;
                filterManufacturer.appendChild(option);
            });
            filterManufacturer.value = currentValue;
        }

        function generateManualEntryForm() {
            manualEntryForm.innerHTML = '';
            const groups = [
                { title: 'Identification', fields: FIELDS.slice(0, 5) },
                { title: 'Specifications', fields: FIELDS.slice(5, 9) },
                { title: 'Quantities', fields: FIELDS.slice(9, 15) },
                { title: 'Supplier Information', fields: FIELDS.slice(15, 21) },
                { title: 'Pricing', fields: FIELDS.slice(21, 28) },
                { title: 'Additional', fields: FIELDS.slice(34) }
            ];

            groups.forEach(group => {
                const section = document.createElement('div');
                section.className = 'detail-section';
                const heading = document.createElement('h3');
                heading.textContent = group.title;
                section.appendChild(heading);
                const grid = document.createElement('div');
                grid.className = 'detail-grid';
                group.fields.forEach(field => {
                    if (field.readonly) return;
                    const formRow = document.createElement('div');
                    formRow.className = 'form-row';
                    const label = document.createElement('label');
                    label.textContent = field.label;
                    formRow.appendChild(label);
                    let input;
                    if (field.type === 'select') {
                        input = document.createElement('select');
                        field.options.forEach(opt => {
                            const option = document.createElement('option');
                            option.value = opt;
                            option.textContent = opt;
                            input.appendChild(option);
                        });
                    } else {
                        input = document.createElement('input');
                        input.type = field.type;
                        if (field.type === 'number') input.step = '0.01';
                    }
                    input.id = `form - ${field.key} `;
                    input.dataset.key = field.key;
                    formRow.appendChild(input);
                    grid.appendChild(formRow);
                });
                section.appendChild(grid);
                manualEntryForm.appendChild(section);
            });
        }

        function openManualEntryForm() {
            const inputs = manualEntryForm.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.value = input.type === 'select' ? (input.dataset.key === 'currency' ? 'EUR' : input.options[0].value) : '';
            });
            sheetManualEntry.classList.remove('hidden');
            const firstInput = manualEntryForm.querySelector('input');
            if (firstInput) firstInput.focus();
        }

        function saveManualEntry() {
            const item = {};
            const inputs = manualEntryForm.querySelectorAll('input, select');
            inputs.forEach(input => { item[input.dataset.key] = input.value; });
            calculateEuroValues(item);
            if (!currentProject.items) currentProject.items = [];
            currentProject.items.push(item);
            updateProject(currentProject);
            renderCompactTable();
            updateStats();
            renderSidebar();
            updateSupplierFilter();
            sheetManualEntry.classList.add('hidden');
        }

        function calculateEuroValues(item) {
            const currency = item.currency || 'EUR';
            const rate = CURRENCY_RATES[currency] || 1;
            if (item.price_1) item.price_1_euro = (parseFloat(item.price_1) * rate).toFixed(2);
            if (item.price_2) item.price_2_euro = (parseFloat(item.price_2) * rate).toFixed(2);
            if (item.price_3) item.price_3_euro = (parseFloat(item.price_3) * rate).toFixed(2);
            if (item.price_4) item.price_4_euro = (parseFloat(item.price_4) * rate).toFixed(2);
            if (item.shipping_cost) item.shipping_cost_euro = (parseFloat(item.shipping_cost) * rate).toFixed(2);
            if (item.additional_cost_orig) item.additional_cost = (parseFloat(item.additional_cost_orig) * rate).toFixed(2);
        }

        function renderSidebar() {
            sidebarProjects.innerHTML = '';
            projects = getProjects();
            if (projects.length === 0) {
                sidebarProjects.innerHTML = '<div style="padding: 12px; font-size: 12px; color: #999; text-align: center;">No projects</div>';
                return;
            }
            projects.forEach(project => {
                const item = document.createElement('div');
                item.className = 'sidebar-item';
                const isActive = projectPickerIsOpen
                    ? (projectPickerPendingId && String(projectPickerPendingId) === String(project.id))
                    : (currentProject && String(currentProject.id) === String(project.id));
                if (isActive) item.classList.add('active');

                // Project Name and Count
                const info = document.createElement('div');
                info.style.cssText = 'flex: 1; display: flex; justify-content: space-between; align-items: center;';
                info.innerHTML = `<span>${project.name}</span> <span class="sidebar-item-count" style="background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 10px; font-size: 11px;">${project.items ? project.items.length : 0}</span>`;
                info.addEventListener('click', () => {
                    if (projectPickerIsOpen) {
                        projectPickerPendingId = project.id;
                        // Update active highlight without changing the project yet
                        renderSidebar();
                        return;
                    }
                    openProject(project);
                });

                // Actions
                const actions = document.createElement('div');
                actions.className = 'sidebar-actions';
                actions.style.cssText = 'display: none; gap: 4px; margin-left: 8px;';

                const btnRename = document.createElement('button');
                btnRename.textContent = '✏️';
                btnRename.style.cssText = 'border: none; background: none; cursor: pointer; font-size: 12px; padding: 2px;';
                btnRename.title = 'Rename';
                btnRename.onclick = (e) => { e.stopPropagation(); handleRenameProject(project); };

                const btnDelete = document.createElement('button');
                btnDelete.textContent = '🗑️';
                btnDelete.style.cssText = 'border: none; background: none; cursor: pointer; font-size: 12px; padding: 2px;';
                btnDelete.title = 'Delete';
                btnDelete.onclick = (e) => { e.stopPropagation(); handleDeleteProject(project); };

                actions.appendChild(btnRename);
                actions.appendChild(btnDelete);

                item.appendChild(info);
                item.appendChild(actions);

                // Show actions on hover
                item.addEventListener('mouseenter', () => actions.style.display = 'flex');
                item.addEventListener('mouseleave', () => actions.style.display = 'none');

                sidebarProjects.appendChild(item);
            });
        }

        function handleRenameProject(project) {
            const newName = prompt('Enter new project name:', project.name);
            if (newName && newName.trim() !== '') {
                project.name = newName.trim();
                updateProject(project);
                renderSidebar();
                if (currentProject && currentProject.id === project.id) {
                    setProjectNameUI(project.name);
                    renderDashboardProjects(); // Update select in dashboard
                }
            }
        }

        function handleDeleteProject(project) {
            if (confirm(`Are you sure you want to delete project "${project.name}" ? `)) {
                const { deleteProject } = window.RFQData; // Access delete function
                deleteProject(project.id);
                projects = getProjects(); // Refresh local list

                if (currentProject && currentProject.id === project.id) {
                    currentProject = null;
                    if (projects.length > 0) {
                        openProject(projects[0]);
                    } else {
                        showEmptyState();
                        renderSidebar();
                    }
                } else {
                    renderSidebar();
                }
                renderDashboardProjects();
            }
        }

        function handleCreateProject() {
            const name = (inputNewProjectName && inputNewProjectName.value ? inputNewProjectName.value.trim() : '');
            if (!name) {
                alert('Please enter a project name');
                return;
            }

            // Keep project dates/details (do not remove older behavior)
            const dateRec = getEl('new-project-received');
            const dateBom = getEl('new-project-bom');
            const dateDeadline = getEl('new-project-deadline');
            const dateSent = getEl('new-project-sent');
            const inputSentTo = getEl('new-project-sent-to');

            const extraData = {
                received: dateRec ? dateRec.value : '',
                bom_received: dateBom ? dateBom.value : '',
                deadline: dateDeadline ? dateDeadline.value : '',
                sent: dateSent ? dateSent.value : '',
                sent_to: inputSentTo ? inputSentTo.value : ''
            };

            const newProject = (typeof createProject === 'function') ? createProject(name, extraData) : null;
            if (!newProject) return;

            // close modal + clear inputs
            if (sheetNewProject) sheetNewProject.classList.add('hidden');
            if (inputNewProjectName) inputNewProjectName.value = '';
            if (dateRec) dateRec.value = '';
            if (dateBom) dateBom.value = '';
            if (dateDeadline) dateDeadline.value = '';
            if (dateSent) dateSent.value = '';
            if (inputSentTo) inputSentTo.value = '';

            projects = (typeof getProjects === 'function') ? getProjects() : (projects || []);
            renderSidebar();
            renderDashboardProjects();

            // Open the new project (and persist active selection)
            openProject(newProject);
        }

        function openProject(project) {
            const projectPicker = getEl('project-picker');
            if (projectPicker) {
                projectPicker.classList.add('hidden');
                projectPicker.setAttribute('aria-hidden','true');
            }
            currentProject = project;
            projectPickerIsOpen = false;
            projectPickerPendingId = null;
            localStorage.setItem('rfq_active_project_id', project.id);
            if (typeof updateProject === 'function') updateProject(currentProject);
            if (currentProjectName) setProjectNameUI(project.name);
            renderSidebar();

            window.currentProject = currentProject; // Ensure global access

            // Reset selection on project switch
            selectedItems.clear();
            updateBulkActionBar();

            if (currentView === 'dashboard') {
                renderDashboard();
            } else if (currentView === 'items') {
                renderCompactTable();
                updateStats();
                updateSupplierFilter();
                updateManufacturerFilter();
            } else if (currentView === 'database') {
                renderDatabase();
            } else if (currentView === 'suppliers') {
                if (typeof renderSuppliers === 'function') renderSuppliers();
            }
        }


        // Helper: select/open project by id (used by cross-project navigation)
        window.selectProjectById = function (projectId) {
            const id = String(projectId || '').trim();
            if (!id) return null;
            const proj = (projects || []).find(p => p && String(p.id) === id) || null;
            if (!proj) return null;
            openProject(proj);
            return proj;
        };


        function showEmptyState() {
            if (emptyState) emptyState.classList.remove('hidden');
        }

        // Items SuperTable instance
        let itemsSuperTable = null;

        // Helper to get main supplier info
        function getMainSupplierInfo(item) {
            let mainSup = null;
            try {
                if (Array.isArray(item.suppliers)) {
                    mainSup = item.suppliers.find(s => s && (s.isMain || s.is_main)) || item.suppliers[0] || null;
                }
            } catch (e) {}
            const name = (mainSup && (mainSup.name || mainSup.supplier_name || mainSup.supplier)) ? (mainSup.name || mainSup.supplier_name || mainSup.supplier) : (item.supplier || '');
            const currency = (mainSup && (mainSup.currency || mainSup.cur)) ? (mainSup.currency || mainSup.cur) : (item.currency || 'EUR');
            return { mainSup, name, currency };
        }

        // Helper to get price from supplier
        function getItemPrice(item, priceIndex) {
            const { mainSup } = getMainSupplierInfo(item);
            try {
                let v = mainSup ? getSupplierPriceByIndex(mainSup, priceIndex) : '';
                if (!v) {
                    v = (priceIndex === 1) ? (item.price_1 || item.price || '') : (item[`price_${priceIndex}`] || '');
                }
                return v || '';
            } catch (e) {
                return '';
            }
        }

        // Helper to get sourcing strategy count
        function getSSCount(item) {
            let ssCount = 0;
            try {
                if (Array.isArray(item.sourcing_targets)) ssCount = item.sourcing_targets.length;
                else if (Array.isArray(item.sourcingTargets)) ssCount = item.sourcingTargets.length;
                else if (Array.isArray(item.sourcing_strategy)) ssCount = item.sourcing_strategy.length;
                else if (typeof item.sourcingStrategy === 'string') {
                    ssCount = item.sourcingStrategy.split(',').map(s => String(s || '').trim()).filter(Boolean).length;
                }
            } catch (e) {}
            if (!ssCount) ssCount = Array.isArray(item.suppliers) ? item.suppliers.length : 0;
            return ssCount;
        }

        // Helper to get extra quantities
        function getQtyNext(item) {
            try {
                const extra = [];
                const maxIdx = getMaxQtyIndex(item, 5);
                for (let i = 6; i <= maxIdx; i++) {
                    const v = String(item[`qty_${i}`] ?? '').trim();
                    if (v) extra.push(`Q${i}=${v}`);
                }
                return extra.join(' | ');
            } catch (e) {
                return '';
            }
        }

        // Define columns for Items SuperTable
        const itemsTableColumns = [
            { id: 'checkbox', type: 'checkbox', width: 40 },
            { id: 'line', title: 'Line #', width: 70, getValue: (item) => item.line || (currentProject.items.indexOf(item) + 1) },
            { id: 'item_drawing_no', title: 'Item/Drawing No.', width: 140 },
            { id: 'description', title: 'Description', width: 200 },
            { id: 'manufacturer', title: 'Manufacturer', width: 120 },
            { id: 'mpn', title: 'MPN', width: 100 },
            {
                id: 'status',
                title: 'Status',
                width: 110,
                getValue: (item) => item.status || 'New',
                render: (item, idx) => {
                    const statusSelect = document.createElement('select');
                    statusSelect.className = 'inline-status-select';
                    const currentStatus = item.status || 'New';
                    statusSelect.style.cssText = 'padding: 4px 8px; border-radius: 4px; border: 1px solid #ddd; font-size: 11px; cursor: pointer; background: ' + getStatusColorUnified(currentStatus) + '; color: white; font-weight: 500;';
                    ITEM_STATUSES.forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt;
                        option.textContent = opt;
                        if (opt === currentStatus) option.selected = true;
                        statusSelect.appendChild(option);
                    });
                    statusSelect.addEventListener('change', (e) => {
                        e.stopPropagation();
                        item.status = e.target.value;
                        e.target.style.background = getStatusColorUnified(e.target.value);
                        updateProject(currentProject);
                        updateStats();
                        if (currentView === 'dashboard') renderDashboard();
                    });
                    statusSelect.addEventListener('click', (e) => e.stopPropagation());
                    return statusSelect;
                }
            },
            { id: 'qty_1', title: 'Qty 1', width: 70, type: 'number' },
            { id: 'qty_2', title: 'Qty 2', width: 70, type: 'number' },
            { id: 'qty_3', title: 'Qty 3', width: 70, type: 'number' },
            { id: 'qty_4', title: 'Qty 4', width: 70, type: 'number' },
            { id: 'qty_5', title: 'Qty 5', width: 70, type: 'number' },
            { id: 'qty_next', title: 'Qty next…', width: 100, getValue: getQtyNext },
            { id: 'supplier', title: 'Supplier', width: 140, getValue: (item) => getMainSupplierInfo(item).name },
            { id: 'currency', title: 'Currency', width: 80, getValue: (item) => getMainSupplierInfo(item).currency },
            { id: 'price_1', title: 'Price 1', width: 90, getValue: (item) => getItemPrice(item, 1), type: 'number' },
            { id: 'price_2', title: 'Price 2', width: 90, getValue: (item) => getItemPrice(item, 2), type: 'number' },
            { id: 'price_3', title: 'Price 3', width: 90, getValue: (item) => getItemPrice(item, 3), type: 'number' },
            { id: 'price_4', title: 'Price 4', width: 90, getValue: (item) => getItemPrice(item, 4), type: 'number' },
            { id: 'price_5', title: 'Price 5', width: 90, getValue: (item) => getItemPrice(item, 5), type: 'number' },
            { id: 'ss_count', title: 'SS #', width: 60, getValue: getSSCount, type: 'number' },
            { id: 'action', type: 'action', width: 50 }
        ];

        function renderCompactTable() {
            // Show/hide empty state based on whether we have items
            if (!currentProject || !currentProject.items || currentProject.items.length === 0) {
                if (emptyState) emptyState.classList.remove('hidden');
                const container = document.getElementById('items-super-table-container');
                if (container) container.innerHTML = '';
                return;
            }

            // Hide empty state when we have items to display
            if (emptyState) emptyState.classList.add('hidden');

            // Create or update SuperTable
            itemsSuperTable = createSuperTable('items-super-table-container', {
                columns: itemsTableColumns,
                storageKey: 'rfq_items_super_table',
                pageSize: 100,
                onRowClick: (item, idx) => {
                    openDetailWindow(idx);
                },
                onSelectionChange: (selectedItems) => {
                    // Update bulk action bar
                    const bulkBar = document.getElementById('bulk-action-bar');
                    const bulkCount = document.getElementById('bulk-count');
                    if (selectedItems.length > 0) {
                        if (bulkBar) bulkBar.classList.remove('hidden');
                        if (bulkCount) bulkCount.textContent = selectedItems.length;
                    } else {
                        if (bulkBar) bulkBar.classList.add('hidden');
                    }
                }
            });

            // Set the data
            itemsSuperTable.setData(currentProject.items);

            // Update stats
            updateStats();
        }

        function getStatusColor(status) {
            return getStatusColorUnified(status);
        }

        function openItemDetail(index) { return openDetailWindow(index); }

        function openDetailWindow(index) {
            const prevView = currentView;
            currentDetailIndex = index;

            // remember where we came from (don't overwrite when we re-render inside item-detail)
            if (prevView && prevView !== 'item-detail') {
                itemDetailReturnView = prevView;
            }

            // switch to full page view (consistent with the rest of the app)
            if (typeof switchView === 'function') switchView('item-detail');
            if (detailWindow) detailWindow.classList.add('hidden');

            const item = currentProject.items[index];

            const pageTitleEl = getEl('item-detail-page-title');
            if (pageTitleEl) pageTitleEl.textContent = `Item Detail • #${item.line || (index + 1)} • ${item.item_drawing_no || ''}`.trim();

            const activeDetailRoot = getEl('item-detail-page-content') || detailContent;
            activeDetailRoot.innerHTML = '';

            // Initialize suppliers array if missing
            if (!item.suppliers) {
                item.suppliers = [];
                if (item.supplier || item.price_1) {
                    item.suppliers.push({
                        id: Date.now(),
                        name: item.supplier || 'Unknown',
                        price: item.price_1 || 0,
                        currency: item.currency || 'EUR',
                        isMain: true
                    });
                }
            }

            // --- LAYOUT SETUP (Matching Main page style) ---
            // Main Container Grid
            const mainGrid = document.createElement('div');
            mainGrid.className = 'item-detail-layout';

            // Left Column (Image & Actions)
            const leftCol = document.createElement('div');
            leftCol.className = 'item-detail-left';

            // Right Column (Content with Tabs)
            const rightCol = document.createElement('div');
            rightCol.className = 'item-detail-right';

            // Tab Header (using sd-tabs style)
            const tabHeader = document.createElement('div');
            tabHeader.className = 'item-detail-tabs';
            tabHeader.innerHTML = `
                <button class="item-detail-tab active" data-tab="basic">Basic Information</button>
                <button class="item-detail-tab" data-tab="pricing">Pricing</button>
                <button class="item-detail-tab" data-tab="others">Others</button>
            `;

            // Tab Content Containers
            const tabBasic = document.createElement('div');
            tabBasic.id = 'tab-basic';
            tabBasic.className = 'item-detail-panel active';
            tabBasic.style.cssText = 'display: flex; flex-direction: column; gap: 16px;';

            const tabPricing = document.createElement('div');
            tabPricing.id = 'tab-pricing';
            tabPricing.className = 'item-detail-panel';
            tabPricing.style.cssText = 'display: none; flex-direction: column; gap: 16px;';

            const tabOthers = document.createElement('div');
            tabOthers.id = 'tab-others';
            tabOthers.className = 'item-detail-panel';
            tabOthers.style.cssText = 'display: none; flex-direction: column; gap: 16px;';

            // Tab Switching Logic
            tabHeader.querySelectorAll('.item-detail-tab').forEach(btn => {
                btn.onclick = () => {
                    // Update tab header buttons
                    tabHeader.querySelectorAll('.item-detail-tab').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // Hide all tab contents
                    [tabBasic, tabPricing, tabOthers].forEach(c => {
                        c.classList.remove('active');
                        c.style.display = 'none';
                    });

                    // Show selected tab
                    const tabId = 'tab-' + btn.dataset.tab;
                    if (tabId === 'tab-basic') {
                        tabBasic.classList.add('active');
                        tabBasic.style.display = 'flex';
                    } else if (tabId === 'tab-pricing') {
                        tabPricing.classList.add('active');
                        tabPricing.style.display = 'flex';
                    } else if (tabId === 'tab-others') {
                        tabOthers.classList.add('active');
                        tabOthers.style.display = 'flex';
                    }
                };
            });

            rightCol.appendChild(tabHeader);
            rightCol.appendChild(tabBasic);
            rightCol.appendChild(tabPricing);
            rightCol.appendChild(tabOthers);

            mainGrid.appendChild(leftCol);
            mainGrid.appendChild(rightCol);
            activeDetailRoot.appendChild(mainGrid);

            // --- LEFT COLUMN CONTENT (Matching Main page card style) ---

            // 1. Header Card with Image
            const headerCard = document.createElement('div');
            headerCard.className = 'item-detail-card item-header-card';

            const imageContainer = document.createElement('div');
            imageContainer.className = 'item-header-image';

            const renderImage = () => {
                if (item.image) {
                    imageContainer.innerHTML = `<img src="${item.image}" style="width: 100%; height: 100%; object-fit: cover;">`;
                } else {
                    imageContainer.innerHTML = `<div style="font-size: 48px; color: #ccc;">📷</div>`;
                }
            };
            renderImage();

            const headerTitle = document.createElement('div');
            headerTitle.className = 'item-header-title';
            headerTitle.textContent = item.item_drawing_no || `Item #${item.line || (index + 1)}`;

            const headerSubtitle = document.createElement('div');
            headerSubtitle.className = 'item-header-subtitle';
            headerSubtitle.textContent = item.description || 'No description';

            headerCard.appendChild(imageContainer);
            headerCard.appendChild(headerTitle);
            headerCard.appendChild(headerSubtitle);

            // 2. KPIs Card
            const kpiCard = document.createElement('div');
            kpiCard.className = 'item-detail-card';
            kpiCard.innerHTML = `<div class="item-detail-card-title">Statistics</div>`;

            const kpiGrid = document.createElement('div');
            kpiGrid.className = 'item-kpi-grid';

            // Calculate KPIs
            const suppliersCount = Array.isArray(item.suppliers) ? item.suppliers.length : (item.supplier ? 1 : 0);
            const mainSupplier = Array.isArray(item.suppliers) ? item.suppliers.find(s => s && (s.isMain || s.is_main)) : null;
            const bestPrice = mainSupplier ? (mainSupplier.price || mainSupplier.price_1 || 0) : (item.price_1 || item.price || 0);
            const qty1 = parseFloat(item.qty_1 || 1) || 1;
            const totalValue = parseFloat(bestPrice) * qty1;

            kpiGrid.innerHTML = `
                <div class="item-kpi">
                    <div class="item-kpi-label">Suppliers</div>
                    <div class="item-kpi-value info">${suppliersCount}</div>
                </div>
                <div class="item-kpi">
                    <div class="item-kpi-label">Status</div>
                    <div class="item-kpi-value">${item.status || 'New'}</div>
                </div>
                <div class="item-kpi">
                    <div class="item-kpi-label">Best Price</div>
                    <div class="item-kpi-value success">${bestPrice ? '€' + parseFloat(bestPrice).toFixed(2) : '—'}</div>
                </div>
                <div class="item-kpi">
                    <div class="item-kpi-label">Total Value</div>
                    <div class="item-kpi-value success">${totalValue ? '€' + totalValue.toFixed(0) : '—'}</div>
                </div>
            `;
            kpiCard.appendChild(kpiGrid);

            // 3. Quick Actions Card
            const actionsCard = document.createElement('div');
            actionsCard.className = 'item-detail-card';
            actionsCard.innerHTML = `<div class="item-detail-card-title">Quick Actions</div>`;

            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'item-quick-actions';

            // Image Upload Button
            const btnUploadImg = document.createElement('button');
            btnUploadImg.innerHTML = '📷 Add Photo';
            btnUploadImg.className = 'btn';
            btnUploadImg.onclick = () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            item.image = ev.target.result;
                            updateProject(currentProject);
                            renderImage();
                        };
                        reader.readAsDataURL(file);
                    }
                };
                input.click();
            };

            // ISSUE BUTTON
            const btnToggleIssue = document.createElement('button');
            const isIssue = item.status === 'Issue';
            btnToggleIssue.innerHTML = isIssue ? '✅ Resolve Issue' : '⚠️ Mark as Issue';
            btnToggleIssue.className = isIssue ? 'btn btn-primary' : 'btn btn-danger';

            btnToggleIssue.onclick = () => {
                const now = new Date().toLocaleString();
                if (!item.issueHistory) item.issueHistory = [];

                if (item.status === 'Issue') {
                    item.status = 'Pending';
                    item.issueHistory.push({ type: 'Resolved', date: now });
                } else {
                    item.status = 'Issue';
                    item.issueHistory.push({ type: 'Marked as Issue', date: now });
                }
                updateProject(currentProject);
                renderCompactTable();
                if (currentView === 'dashboard') renderDashboard();
                openDetailWindow(index);
            };

            // COPY LINK BUTTON
            const btnCopyLink = document.createElement('button');
            btnCopyLink.innerHTML = '🔗 Copy Link';
            btnCopyLink.className = 'btn';
            btnCopyLink.onclick = () => {
                const linkText = `RFQ Item: ${item.item_drawing_no} (${currentProject.name})`;
                navigator.clipboard.writeText(linkText).then(() => {
                    btnCopyLink.innerHTML = '✅ Copied!';
                    setTimeout(() => btnCopyLink.innerHTML = '🔗 Copy Link', 2000);
                });
            };

            // EXPORT BUTTON
            const btnExportItem = document.createElement('button');
            btnExportItem.innerHTML = '📤 Export Details';
            btnExportItem.className = 'btn';
            btnExportItem.onclick = () => exportSingleItem(item);

            actionsContainer.appendChild(btnUploadImg);
            actionsContainer.appendChild(btnToggleIssue);
            actionsContainer.appendChild(btnCopyLink);
            actionsContainer.appendChild(btnExportItem);
            actionsCard.appendChild(actionsContainer);

            // Append cards to left column
            leftCol.appendChild(headerCard);
            leftCol.appendChild(kpiCard);
            leftCol.appendChild(actionsCard);

            // History Section Card
            if (item.issueHistory && item.issueHistory.length > 0) {
                const historyCard = document.createElement('div');
                historyCard.className = 'item-detail-card';
                historyCard.innerHTML = `
                    <div class="item-detail-card-title">Issue History</div>
                    <ul style="padding-left: 20px; margin: 0; font-size: 12px; color: #666;">
                        ${item.issueHistory.map(h => `<li style="margin-bottom: 4px;">${h.date}: ${h.type}</li>`).join('')}
                    </ul>
                `;
                leftCol.appendChild(historyCard);
            }

            // --- COMMENTS SECTION (Moved to Left Col) - Card style ---
            const commentsSection = document.createElement('div');
            commentsSection.className = 'item-detail-card';
            commentsSection.innerHTML = `
                <div class="item-detail-card-title">Comments</div>
                <div class="item-comments-list" id="comments-list"></div>
                <div class="item-comment-input-row">
                    <textarea id="new-comment" rows="1" placeholder="Add comment..."></textarea>
                    <button id="btn-post-comment">Post</button>
                </div>
            `;
            leftCol.appendChild(commentsSection);

            const renderComments = () => {
                const list = commentsSection.querySelector('#comments-list');
                list.innerHTML = (item.comments || []).map(c => `<div class="item-comment"><span class="item-comment-time">${new Date(c.timestamp).toLocaleTimeString()}</span>${c.text}</div>`).join('');
            };
            renderComments();
            commentsSection.querySelector('#btn-post-comment').onclick = () => {
                const txt = commentsSection.querySelector('#new-comment');
                if (txt.value.trim()) {
                    if (!item.comments) item.comments = [];
                    item.comments.push({ text: txt.value, timestamp: new Date().toISOString() });
                    updateProject(currentProject);
                    txt.value = '';
                    renderComments();
                }
            };

            // Clone Comments to Pricing and Others tabs - using card style
            const commentsPricingClone = document.createElement('div');
            commentsPricingClone.className = 'item-detail-card';
            commentsPricingClone.innerHTML = `<div class="item-detail-card-title">Comments</div><div class="item-comments-list" id="comments-list-pricing"></div>`;
            tabPricing.appendChild(commentsPricingClone);

            const commentsOthersClone = document.createElement('div');
            commentsOthersClone.className = 'item-detail-card';
            commentsOthersClone.innerHTML = `<div class="item-detail-card-title">Comments</div><div class="item-comments-list" id="comments-list-others"></div><div class="item-comment-input-row"><textarea id="new-comment-others" rows="1" placeholder="Add comment..."></textarea><button id="btn-post-comment-others">Post</button></div>`;
            tabOthers.appendChild(commentsOthersClone);

            // Sync render for all Comments sections
            const renderAllComments = () => {
                const html = (item.comments || []).map(c => `<div class="item-comment"><span class="item-comment-time">${new Date(c.timestamp).toLocaleTimeString()}</span>${c.text}</div>`).join('');
                const list1 = commentsSection.querySelector('#comments-list');
                const list2 = commentsPricingClone.querySelector('#comments-list-pricing');
                const list3 = commentsOthersClone.querySelector('#comments-list-others');
                if (list1) list1.innerHTML = html;
                if (list2) list2.innerHTML = html;
                if (list3) list3.innerHTML = html;
            };
            renderAllComments();

            // Post comment handler for Others tab
            commentsOthersClone.querySelector('#btn-post-comment-others').onclick = () => {
                const txt = commentsOthersClone.querySelector('#new-comment-others');
                if (txt.value.trim()) {
                    if (!item.comments) item.comments = [];
                    item.comments.push({ text: txt.value, timestamp: new Date().toISOString() });
                    updateProject(currentProject);
                    txt.value = '';
                    renderAllComments();
                }
            };

            // --- ATTACHMENTS SECTION (Moved to Left Col) - Card style ---
            const attachSection = document.createElement('div');
            attachSection.className = 'item-detail-card';
            attachSection.innerHTML = `
                <div class="item-detail-card-title">Attachments</div>
                <div class="item-attachments-list" id="att-list"></div>
                <button id="btn-add-attachment" class="btn" style="width: 100%;">+ Add Files</button>
                <input type="file" id="att-upload" multiple style="display: none;">
            `;
            leftCol.appendChild(attachSection);

            const renderAtts = () => {
                const list = attachSection.querySelector('#att-list');
                list.innerHTML = (item.attachments || []).map((f, i) => `
                    <div class="item-attachment">
                        <span class="item-attachment-name">📄 ${f.name}</span>
                        <button class="btn-download btn-download-att" data-idx="${i}" title="Download">⬇</button>
                        <button class="btn-remove btn-remove-att" data-idx="${i}" title="Remove">×</button>
                    </div>
                `).join('');

                // Attach event listeners to buttons
                list.querySelectorAll('.btn-download-att').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const idx = parseInt(e.currentTarget.dataset.idx);
                        console.log('Download clicked, idx:', idx);
                        console.log('Total attachments:', item.attachments ? item.attachments.length : 0);
                        console.log('Attachment at idx:', item.attachments[idx]);

                        const f = item.attachments[idx];
                        if (f && f.data) {
                            console.log('Downloading file:', f.name);
                            const a = document.createElement('a');
                            a.href = f.data;
                            a.download = f.name || 'attachment';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        } else {
                            alert('Cannot download (file data missing)');
                        }
                    });
                });

                list.querySelectorAll('.btn-remove-att').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        console.log('Delete button clicked');
                        const idx = parseInt(e.currentTarget.dataset.idx);
                        console.log('Delete idx:', idx);
                        console.log('Attachments before delete:', item.attachments ? item.attachments.length : 0);

                        if (!confirm('Delete attachment?')) {
                            console.log('Delete cancelled by user');
                            return;
                        }

                        console.log('Deleting attachment at index:', idx);
                        item.attachments.splice(idx, 1);
                        console.log('Attachments after delete:', item.attachments.length);
                        updateProject(currentProject);
                        renderAtts();
                        console.log('Delete complete, list re-rendered');
                    });
                });
            };
            renderAtts();

            // Wire up the styled button to trigger file input
            attachSection.querySelector('#btn-add-attachment').onclick = () => {
                attachSection.querySelector('#att-upload').click();
            };

            attachSection.querySelector('#att-upload').onchange = (e) => {
                if (!item.attachments) item.attachments = [];
                Array.from(e.target.files).forEach(f => {
                    if (f.size > 5 * 1024 * 1024) {
                        alert(`File ${f.name} is too large (>5MB). LocalStorage has limits.`);
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        item.attachments.push({
                            name: f.name,
                            size: f.size,
                            type: f.type,
                            data: ev.target.result // Base64 string
                        });
                        updateProject(currentProject);
                        renderAtts();
                    };
                    reader.readAsDataURL(f);
                });
            };

            // Clone Attachments to Others tab - Card style
            const attachOthersClone = document.createElement('div');
            attachOthersClone.className = 'item-detail-card';
            attachOthersClone.innerHTML = `
                <div class="item-detail-card-title">Attachments</div>
                <div class="item-attachments-list" id="att-list-others"></div>
                <button id="btn-add-attachment-others" class="btn" style="width: 100%;">+ Add Files</button>
                <input type="file" id="att-upload-others" multiple style="display: none;">
            `;
            tabOthers.appendChild(attachOthersClone);

            // Sync render for all Attachments sections
            const renderAllAtts = () => {
                const html = (item.attachments || []).map((f, i) => `
                    <div class="item-attachment">
                        <span class="item-attachment-name">📄 ${f.name}</span>
                        <button class="btn-download btn-download-att-others" data-idx="${i}" title="Download">⬇</button>
                        <button class="btn-remove btn-remove-att-others" data-idx="${i}" title="Remove">×</button>
                    </div>
                `).join('');
                const list = attachOthersClone.querySelector('#att-list-others');
                if (list) list.innerHTML = html;

                // Attach event listeners
                list.querySelectorAll('.btn-download-att-others').forEach(btn => {
                    btn.onclick = () => {
                        const idx = parseInt(btn.dataset.idx);
                        const f = item.attachments[idx];
                        if (f && f.data) {
                            const a = document.createElement('a');
                            a.href = f.data;
                            a.download = f.name || 'attachment';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        }
                    };
                });

                list.querySelectorAll('.btn-remove-att-others').forEach(btn => {
                    btn.onclick = () => {
                        const idx = parseInt(btn.dataset.idx);
                        if (!confirm('Delete attachment?')) return;
                        item.attachments.splice(idx, 1);
                        updateProject(currentProject);
                        renderAtts();
                        renderAllAtts();
                    };
                });
            };
            renderAllAtts();

            // Wire up Others tab buttons
            attachOthersClone.querySelector('#btn-add-attachment-others').onclick = () => {
                attachOthersClone.querySelector('#att-upload-others').click();
            };

            attachOthersClone.querySelector('#att-upload-others').onchange = (e) => {
                if (!item.attachments) item.attachments = [];
                Array.from(e.target.files).forEach(f => {
                    if (f.size > 5 * 1024 * 1024) {
                        alert(`File ${f.name} is too large (>5MB).`);
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        item.attachments.push({
                            name: f.name,
                            size: f.size,
                            type: f.type,
                            data: ev.target.result
                        });
                        updateProject(currentProject);
                        renderAtts();
                        renderAllAtts();
                    };
                    reader.readAsDataURL(f);
                });
            };


            // --- RIGHT COLUMN CONTENT ---

            // Duplicate Detection Alert
            const findDuplicateParts = (window.RFQData && typeof window.RFQData.findDuplicateParts === 'function')
                ? window.RFQData.findDuplicateParts
                : (() => []);
            const duplicates = findDuplicateParts(item.item_drawing_no, item.mpn, currentProject && currentProject.id);

            if (duplicates.length > 0) {
                const duplicateAlert = document.createElement('div');
                duplicateAlert.style.cssText = `
                    background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
                    color: white;
                    padding: 16px 20px;
                    border-radius: 12px;
                    margin-bottom: 16px;
                    box-shadow: 0 4px 12px rgba(255, 149, 0, 0.3);
                `;

                const matchInfo = duplicates.map(d => {
                    const matchLabel = d.matchType === 'drawing_no' ? 'Drawing No' : 'MPN';
                    const price = d.item.price_1_euro ? `€${parseFloat(d.item.price_1_euro).toFixed(2)}` : 'N/A';
                    const supplier = d.item.supplier || 'Unknown';

                    return `
                        <div style="margin-top: 8px; padding: 8px; background: rgba(255,255,255,0.15); border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="font-weight: 600; margin-bottom: 4px;">📂 ${d.projectName}</div>
                                <div style="font-size: 11px; opacity: 0.9;">Matched by ${matchLabel} • Supplier: ${supplier} • Price: ${price}</div>
                            </div>
                            <button onclick="window.openItemInProject('${d.projectId}', '${d.item.item_drawing_no}')" 
                                    style="background: white; color: #FF9500; border: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">
                                View →
                            </button>
                        </div>
                    `;
                }).join('');

                duplicateAlert.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                        <div style="font-size: 24px;">⚠️</div>
                        <div>
                            <div style="font-weight: 700; font-size: 15px;">Duplicate Part Found!</div>
                            <div style="font-size: 12px; opacity: 0.95;">This part was previously quoted in ${duplicates.length} other project${duplicates.length > 1 ? 's' : ''}:</div>
                        </div>
                    </div>
                    ${matchInfo}
                `;

                tabBasic.appendChild(duplicateAlert);
            }

            // 1. Info Banner - Gradient banner matching Main page style
            const banner = document.createElement('div');
            banner.className = 'item-detail-card';
            banner.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 16px 20px;
                display: flex;
                align-items: center;
                gap: 16px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            `;
            banner.innerHTML = `
                <div style="font-size: 24px; background: rgba(255,255,255,0.2); width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">📝</div>
                <div>
                    <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">
                        Item #${item.line || (index + 1)}: ${item.item_drawing_no || 'No Drawing No.'}
                    </div>
                    <div style="font-size: 13px; opacity: 0.9; line-height: 1.4;">
                        ${item.description || 'No description provided'}
                    </div>
                </div>
            `;
            tabBasic.appendChild(banner);

            // 2. Form Fields Groups - Using card style
            // Quantities are dynamic (qty_1..qty_N). Keep at least 5 tiers visible.
            const qtyMax = getMaxQtyIndex(item, 5);
            const qtyFields = [];
            for (let i = 1; i <= qtyMax; i++) {
                qtyFields.push({ key: `qty_${i}`, label: `QTY ${i}`, type: 'number' });
            }

            const groups = [
                {
                    title: 'Basic Information',
                    fields: FIELDS.filter(f => ['line', 'item_drawing_no', 'description', 'manufacturer', 'mpn', 'status'].includes(f.key))
                },
                {
                    title: 'Quantities',
                    fields: qtyFields
                }
            ];

            groups.forEach(group => {
                if (group.fields.length === 0) return;
                const section = document.createElement('div');
                section.className = 'item-detail-card';

                // Add header with button for Quantities section
                if (group.title === 'Quantities') {
                    const headerDiv = document.createElement('div');
                    headerDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;';
                    headerDiv.innerHTML = `
                        <div class="item-detail-card-title" style="margin: 0;">${group.title}</div>
                        <button id="btn-add-qty" class="btn btn-primary" style="font-size: 11px; padding: 4px 10px;">+ Add More QTY</button>
                    `;
                    section.appendChild(headerDiv);
                } else {
                    section.innerHTML = `<div class="item-detail-card-title">${group.title}</div>`;
                }

                const grid = document.createElement('div');
                grid.className = 'detail-grid';
                if (group.title === 'Quantities') grid.id = 'qty-fields-grid';

                group.fields.forEach(field => {
                    const formRow = document.createElement('div');
                    formRow.className = 'form-row';
                    formRow.innerHTML = `<label>${field.label}</label>`;

                    let input;
                    // Special handling for Status field - make it a dropdown
                    if (field.key === 'status') {
                        input = document.createElement('select');
                        ITEM_STATUSES.forEach(opt => {
                            const option = document.createElement('option');
                            option.value = opt;
                            option.textContent = opt;
                            if (opt === (item.status || 'New')) option.selected = true;
                            input.appendChild(option);
                        });
                        input.style.background = getStatusColorUnified(item.status || 'New');
                        input.style.color = 'white';
                        input.style.fontWeight = '500';
                        input.addEventListener('change', () => {
                            input.style.background = getStatusColorUnified(input.value);
                        });
                    } else if (field.type === 'select') {
                        input = document.createElement('select');
                        field.options.forEach(opt => {
                            const option = document.createElement('option');
                            option.value = opt;
                            option.textContent = opt;
                            input.appendChild(option);
                        });
                        input.value = item[field.key] || (field.key === 'currency' ? 'EUR' : field.options[0]);
                    } else if (field.type === 'textarea') {
                        input = document.createElement('textarea');
                        input.value = item[field.key] || '';
                        input.rows = 3;
                    } else {
                        input = document.createElement('input');
                        input.type = field.type;
                        input.value = item[field.key] || '';
                        if (field.type === 'number') input.step = '0.01';
                        if (field.readonly) input.readOnly = true;
                    }
                    input.dataset.key = field.key;
                    input.className = 'macos-input';

                    // Special handling for MPN field - add Google search button
                    if (field.key === 'mpn') {
                        const mpnContainer = document.createElement('div');
                        mpnContainer.style.cssText = 'display: flex; gap: 8px;';
                        input.style.flex = '1';

                        const googleBtn = document.createElement('button');
                        googleBtn.innerHTML = '🔍 Google';
                        googleBtn.style.cssText = `
                            padding: 8px 12px;
                            background: #4285F4;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 12px;
                            font-weight: 500;
                            white-space: nowrap;
                            transition: background 0.2s;
                        `;
                        googleBtn.onmouseover = () => googleBtn.style.background = '#3367D6';
                        googleBtn.onmouseout = () => googleBtn.style.background = '#4285F4';
                        googleBtn.onclick = (e) => {
                            e.preventDefault();
                            const mpnValue = input.value.trim();
                            if (mpnValue) {
                                window.open(`https://www.google.com/search?q=${encodeURIComponent(mpnValue)}`, '_blank');
                            } else {
                                alert('Please enter an MPN value first.');
                            }
                        };

                        mpnContainer.appendChild(input);
                        mpnContainer.appendChild(googleBtn);
                        formRow.appendChild(mpnContainer);
                    } else {
                        formRow.appendChild(input);
                    }

                    grid.appendChild(formRow);
                });
                section.appendChild(grid);
                tabBasic.appendChild(section);

                // Duplicate Quantities section to Pricing tab
                if (group.title === 'Quantities') {
                    const qtyClone = section.cloneNode(true);
                    qtyClone.querySelector('#btn-add-qty')?.remove(); // Remove button from clone
                    qtyClone.id = 'qty-section-pricing';
                    tabPricing.appendChild(qtyClone);
                }

                // Add event listener for Add More QTY button
                if (group.title === 'Quantities') {
                    const btnAddQty = section.querySelector('#btn-add-qty');
                    if (btnAddQty) {
                        btnAddQty.addEventListener('click', () => {
                            // Find highest existing qty field
                            let maxQtyNum = 5;
                            Object.keys(item).forEach(key => {
                                if (key.startsWith('qty_')) {
                                    const num = parseInt(key.split('_')[1]);
                                    if (num > maxQtyNum) maxQtyNum = num;
                                }
                            });

                            const nextQtyNum = maxQtyNum + 1;
                            const newFieldKey = `qty_${nextQtyNum}`;

                            // Create new field
                            const formRow = document.createElement('div');
                            formRow.className = 'form-row';
                            formRow.innerHTML = `<label>QTY ${nextQtyNum}</label>`;

                            const input = document.createElement('input');
                            input.type = 'number';
                            input.className = 'macos-input';
                            input.dataset.key = newFieldKey;
                            input.value = '';
                            input.step = '0.01';
                            input.placeholder = `Quantity ${nextQtyNum}`;

                            formRow.appendChild(input);
                            grid.appendChild(formRow);

                            // Initialize value in item object if needed
                            if (item[newFieldKey] === undefined) item[newFieldKey] = '';
                        });
                    }
                }
            });

            // 3. Advanced Suppliers Section - Card style
            const supplierSection = document.createElement('div');
            supplierSection.className = 'item-detail-card';

            const renderSuppliers = () => {
                const container = supplierSection.querySelector('#suppliers-container');
                if (!container) return;

                const { getQuoteValidityStatus, getDaysUntilExpiry } = window.RFQData || {};
                const _getDaysUntilExpiry = (typeof getDaysUntilExpiry === 'function') ? getDaysUntilExpiry : () => null;
                const _getQuoteValidityStatus = (typeof getQuoteValidityStatus === 'function') ? getQuoteValidityStatus : () => '';

                const html = item.suppliers.map((sup, idx) => {
                    // Get item's QTY tiers for price display (dynamic)
                    const itemQtys = getItemQtyTiers(item, { includeBlanks: false });

                    // Build prices display
                    let pricesHTML = '';

                    // Decide if we already have any quote values (even if status is still Planned/RFQ Sent)
                    const hasAnyPrice =
                        (sup.prices && Array.isArray(sup.prices) && sup.prices.length > 0) ||
                        (itemQtys.length > 0 && itemQtys.some(t => String(getSupplierPriceByIndex(sup, t.index) ?? '').trim() !== '')) ||
                        String(sup.price ?? '').trim() !== '' ||
                        String(sup.price_1 ?? '').trim() !== '';

                    if ((sup.status === 'Planned' || sup.status === 'RFQ Sent') && !hasAnyPrice) {
                        pricesHTML = `<div style="color: #999; font-style: italic; font-size: 12px; padding: 4px 0;">Waiting for quote...</div>`;
                    } else if (sup.prices && Array.isArray(sup.prices) && sup.prices.length > 0) {
                        // Multi-tier pricing from prices array
                        pricesHTML = sup.prices.map(p =>
                            `<div><span style="color:#888;">@${p.qty}pc:</span> <b>${p.price} ${sup.currency}</b></div>`
                        ).join('');
                    } else if (itemQtys.length > 0) {
                        // Legacy: show tiered prices by index based on current item QTY tiers
                        const legacyPrices = itemQtys.map(t => ({
                            qty: t.value,
                            price: getSupplierPriceByIndex(sup, t.index)
                        })).filter(x => String(x.price ?? '').trim() !== '');

                        pricesHTML = legacyPrices.map((x) => {
                            const qty = x.qty ?? '?';
                            const p = x.price ?? '';
                            return `<div><span style="color:#888;">@${qty}pc:</span> <b>${p} ${sup.currency}</b></div>`;
                        }).join('');
                    } else {
                        pricesHTML = `<div><span style="color:#888;">Price:</span> <b>${sup.price || '-'} ${sup.currency}</b></div>`;
                    }

                    // Workflow Status Badge (Planned/RFQ Sent)
                    let workflowBadge = '';
                    if (sup.status === 'Planned') {
                        workflowBadge = `<span style="background:#8E8E93; color:white; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:600; margin-left:8px;">PLANNED</span>`;
                    } else if (sup.status === 'RFQ Sent') {
                        workflowBadge = `<span style="background:#007AFF; color:white; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:600; margin-left:8px;">RFQ SENT</span>`;
                    }

                    // If user already entered prices in Draft/Sent stage, show it explicitly (so it doesn't look "not updated")
                    if ((sup.status === 'Planned' || sup.status === 'RFQ Sent') && hasAnyPrice) {
                        workflowBadge += `<span style="background:#34C759; color:white; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:600; margin-left:8px;">QUOTE ENTERED</span>`;
                    }

// Quote Validity Badge
                    let validityBadge = '';
                    if (sup.quote_valid_until) {
                        const validityStatus = _getQuoteValidityStatus(sup.quote_valid_until);
                        const daysLeft = _getDaysUntilExpiry(sup.quote_valid_until);
                        let badgeColor = '#34C759'; // Green
                        let badgeText = `Valid ${daysLeft}d`;

                        if (validityStatus === 'expired' || validityStatus === 'critical') {
                            badgeColor = '#FF3B30'; // Red
                            badgeText = daysLeft < 0 ? 'EXPIRED' : `${daysLeft}d left!`;
                        } else if (validityStatus === 'warning') {
                            badgeColor = '#FF9500'; // Orange
                            badgeText = `${daysLeft}d left`;
                        }

                        validityBadge = `<span style="background:${badgeColor}; color:white; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:600; margin-left:8px;">${badgeText}</span>`;
                    }

                    // Additional info row
                    const additionalInfo = [
                        sup.moq ? `<div><span style="color:#888;">MOQ:</span> <b>${sup.moq}</b></div>` : '',
                        sup.mov ? `<div><span style="color:#888;">MOV:</span> <b>${sup.mov}</b></div>` : '',
                        sup.quote_number ? `<div><span style="color:#888;">Quote #:</span> <b>${sup.quote_number}</b></div>` : '',
                        sup.lead_time ? `<div><span style="color:#888;">Lead Time:</span> <b>${sup.lead_time}</b></div>` : '',
                        sup.shipping ? `<div><span style="color:#888;">Shipping:</span> <b>${sup.shipping}</b></div>` : '',
                        sup.incoterms ? `<div><span style="color:#888;">Incoterms:</span> <b>${sup.incoterms}</b></div>` : ''
                    ].filter(x => x).join('');

                    return `
                        <div style="background: ${sup.isMain ? '#f0f9ff' : 'white'}; border: 1px solid ${sup.isMain ? '#007AFF' : '#ddd'}; border-radius: 8px; margin-bottom: 10px; overflow: hidden;">
                            <div style="padding: 10px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #eee;">
                                <input type="radio" name="main-supplier" ${sup.isMain ? 'checked' : ''} data-idx="${idx}" style="cursor: pointer;">
                                <div style="font-weight: 600; font-size: 14px; flex: 1;">${sup.name}${sup.isMain ? ' <span style="background:#007AFF; color:white; padding:2px 6px; border-radius:4px; font-size:10px; margin-left:8px;">MAIN</span>' : ''}${workflowBadge}${validityBadge}</div>
                                <div style="font-size: 12px; color: #666;">${sup.currency}</div>
                                <button class="btn-edit-supplier" data-idx="${idx}" style="background: #e5e5ea; border: none; padding: 4px 10px; border-radius: 4px; font-size: 11px; cursor: pointer;">Edit Details</button>
                                <button class="btn-remove-supplier" data-idx="${idx}" style="background: none; border: none; color: #ff3b30; cursor: pointer; font-size: 16px;">×</button>
                            </div>
                            <div style="padding: 10px; display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; font-size: 12px;">
                                ${pricesHTML}
                                ${additionalInfo}
                            </div>
                        </div>
                    `;
                }).join('');

                container.innerHTML = html || '<div style="text-align: center; color: #999; padding: 20px;">No suppliers added</div>';

                // Also update the Pricing tab clone
                const containerPricing = document.getElementById('suppliers-container-pricing');
                if (containerPricing) {
                    containerPricing.innerHTML = container.innerHTML;
                }

                // Helper to attach listeners to a container
                const attachSupplierListeners = (cont) => {
                    cont.querySelectorAll('input[name="main-supplier"]').forEach(radio => {
                        radio.addEventListener('change', (e) => {
                            const idx = parseInt(e.target.dataset.idx);
                            item.suppliers.forEach((s, i) => s.isMain = i === idx);
                            const main = item.suppliers[idx];
                            item.supplier = main.name;
                            item.price_1 = main.price;
                            item.currency = main.currency;
                            item.price_2 = main.price_2;
                            item.shipping_cost = main.shipping;
                            calculateEuroValues(item);
                            updateProject(currentProject);
                            renderSuppliers();
                            recalculateDetailEuro();
                        });
                    });

                    cont.querySelectorAll('.btn-remove-supplier').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            if (!confirm('Remove supplier?')) return;
                            const idx = parseInt(e.target.dataset.idx);
                            item.suppliers.splice(idx, 1);
                            updateProject(currentProject);
                            renderSuppliers();
                        });
                    });

                    cont.querySelectorAll('.btn-edit-supplier').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const idx = parseInt(e.target.dataset.idx);
                            openSupplierModal(item.suppliers[idx], (updatedSup) => {
                                item.suppliers[idx] = updatedSup;
                                if (updatedSup.isMain) {
                                    item.supplier = updatedSup.name;
                                    item.price_1 = updatedSup.price;
                                    item.currency = updatedSup.currency;
                                    item.price_2 = updatedSup.price_2;
                                    item.shipping_cost = updatedSup.shipping;
                                    calculateEuroValues(item);
                                }
                                updateProject(currentProject);
                                renderSuppliers();
                                recalculateDetailEuro();
                            }, item);
                        });
                    });
                };

                // Attach listeners to both containers
                attachSupplierListeners(container);
                if (containerPricing) attachSupplierListeners(containerPricing);
            };


            // 2.5 Sourcing Strategy (NEW) - Card style
            const sourcingSection = document.createElement('div');
            sourcingSection.className = 'item-detail-card';
            sourcingSection.innerHTML = `
                <div class="item-detail-card-title">Sourcing Strategy</div>
                <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; border: 1px dashed #ccc;">
                    <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px; color: #555;">Add Target Supplier for RFQ</div>
                    <div style="display: flex; gap: 8px;">
                        <input id="quick-rfq-supplier" type="text" class="macos-input" placeholder="e.g. Bosch, Siemens..." style="flex: 1;">
                        <button id="btn-add-target" class="macos-btn" style="background: #FF9500; color: white;">+ Add Target</button>
                    </div>
                    <div style="font-size: 11px; color: #888; margin-top: 6px;">
                        Adds supplier to list as "Planned". Use the "Quoting Process" tab to generate RFQs.
                    </div>
                </div>
                <div id="sourcing-targets-list" style="margin-top:10px;"></div>
            `;

            tabBasic.appendChild(sourcingSection);
            // Clone for Pricing tab
            const sourcingClone = sourcingSection.cloneNode(true);
            sourcingClone.id = 'sourcing-section-pricing';
            // Give cloned elements unique IDs
            const clonedList = sourcingClone.querySelector('#sourcing-targets-list');
            if (clonedList) clonedList.id = 'sourcing-targets-list-pricing';
            const clonedInput = sourcingClone.querySelector('#quick-rfq-supplier');
            if (clonedInput) clonedInput.id = 'quick-rfq-supplier-pricing';
            const clonedBtn = sourcingClone.querySelector('#btn-add-target');
            if (clonedBtn) clonedBtn.id = 'btn-add-target-pricing';
            tabPricing.appendChild(sourcingClone);

            // Render Target Suppliers (visible list + quick actions)
            const renderSourcingTargets = () => {
                const host = sourcingSection.querySelector('#sourcing-targets-list');
                const hostPricing = document.getElementById('sourcing-targets-list-pricing');
                if (!host) return;

                if (!Array.isArray(item.suppliers) || item.suppliers.length === 0) {
                    const emptyMsg = '<div style="font-size:12px; color:#777; padding:6px 2px;">No target suppliers yet.</div>';
                    host.innerHTML = emptyMsg;
                    if (hostPricing) hostPricing.innerHTML = emptyMsg;
                    return;
                }

                const targets = [...item.suppliers]
                    .filter(s => s && (s.name || '').trim())
                    .sort((a,b) => String(a.status||'').localeCompare(String(b.status||'')) || String(a.name||'').localeCompare(String(b.name||'')));

                const badge = (status) => {
                    const s = String(status || 'Planned');
                    const map = {
                        'Planned': 'background:#fff7ed; border:1px solid #fed7aa; color:#9a3412;',
                        'RFQ Sent': 'background:#eff6ff; border:1px solid #bfdbfe; color:#1d4ed8;',
                        'Quote Received': 'background:#ecfdf5; border:1px solid #a7f3d0; color:#065f46;',
                        'No Bid': 'background:#f3f4f6; border:1px solid #e5e7eb; color:#374151;',
                        'Expired': 'background:#fef2f2; border:1px solid #fecaca; color:#991b1b;'
                    };
                    const style = map[s] || 'background:#f3f4f6; border:1px solid #e5e7eb; color:#374151;';
                    return `<span style="font-size:11px; padding:2px 8px; border-radius:999px; ${style}">${escapeHtml(s)}</span>`;
                };

                const htmlContent = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <div style="font-size:12px; font-weight:800; color:#444;">Targets</div>
                        <div style="font-size:11px; color:#777;">${targets.length} supplier(s)</div>
                    </div>
                    <div class="sourcing-targets-cards" style="display:flex; flex-direction:column; gap:6px;">
                        ${targets.map(s => `
                            <div class="target-card" data-sup-id="${escapeHtml(String(s.id ?? s.name))}"
                                 style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:8px; border:1px solid #e5e5e5; border-radius:10px; background:#fff;">
                                <div style="display:flex; flex-direction:column; gap:4px;">
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <div style="font-weight:800; font-size:12px;">${escapeHtml(s.name || '')}</div>
                                        ${badge(s.status)}
                                    </div>
                                    <div style="font-size:11px; color:#666;">
                                        ${(s.price_1 || s.price) ? `Last price: <b>${escapeHtml(String(s.price_1 || s.price))}</b> ${escapeHtml(String(s.currency || ''))}` : 'No quote yet'}
                                        ${s.valid_until ? ` • Valid: ${escapeHtml(String(s.valid_until))}` : ''}
                                    </div>
                                </div>
                                <div style="display:flex; gap:6px; flex-wrap:wrap; justify-content:flex-end;">
                                    <button class="btn-secondary btn-mini" data-action="open-quoting" data-sup-id="${escapeHtml(String(s.id ?? s.name))}">Quoting</button>
                                    <button class="btn-secondary btn-mini" data-action="mark-planned" data-sup-id="${escapeHtml(String(s.id ?? s.name))}">Planned</button>
                                    <button class="btn-danger btn-mini" data-action="remove-target" data-sup-id="${escapeHtml(String(s.id ?? s.name))}">Remove</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;

                host.innerHTML = htmlContent;
                if (hostPricing) hostPricing.innerHTML = htmlContent;

                // Helper to attach sourcing card handlers
                const attachSourcingHandlers = (container) => {
                    const cards = container.querySelector('.sourcing-targets-cards');
                    if (!cards) return;

                    cards.onclick = (e) => {
                        const btn = e.target.closest('button[data-action]');
                        if (!btn) return;
                        const action = btn.dataset.action;
                        const supId = btn.dataset.supId;
                        const idx = (item.suppliers || []).findIndex(s => String(s.id ?? s.name) === String(supId));
                        if (idx < 0) return;

                        if (action === 'open-quoting') {
                            const supName = item.suppliers[idx].name;
                            switchView('quoting');
                            startRFQWizard(supName, [String(item.item_drawing_no || '').trim()].filter(Boolean));
                            return;
                        }

                        if (action === 'mark-planned') {
                            item.suppliers[idx].status = 'Planned';
                            updateProject(currentProject);
                            renderSuppliers();
                            renderSourcingTargets();
                            return;
                        }

                        if (action === 'remove-target') {
                            if (!confirm('Remove target supplier from this item?')) return;
                            item.suppliers.splice(idx, 1);
                            updateProject(currentProject);
                            renderSuppliers();
                            renderSourcingTargets();
                            return;
                        }
                    };
                };

                attachSourcingHandlers(host);
                if (hostPricing) attachSourcingHandlers(hostPricing);
            };

            renderSourcingTargets();

            // Quick Add Target Handler - shared logic
            const handleAddTarget = (inputId) => {
                const input = document.getElementById(inputId);
                if (!input) return;
                const supName = input.value.trim();
                if (!supName) return;

                // Check if already exists
                if (item.suppliers.some(s => s.name.toLowerCase() === supName.toLowerCase())) {
                    alert('Supplier already exists in list!');
                    return;
                }

                const newTarget = {
                    id: Date.now(),
                    name: supName,
                    currency: 'EUR',
                    isMain: false,
                    status: 'Planned',
                    price: 0,
                    price_1: 0
                };

                item.suppliers.push(newTarget);
                const mSup = getOrCreateSupplierMaster(currentProject, supName);
                if (mSup) linkItemSupplierToMaster(newTarget, mSup);
                updateProject(currentProject);
                renderSuppliers();

                input.value = '';
                // Clear both inputs
                const otherInput = document.getElementById(inputId === 'quick-rfq-supplier' ? 'quick-rfq-supplier-pricing' : 'quick-rfq-supplier');
                if (otherInput) otherInput.value = '';
                renderSourcingTargets();
            };

            sourcingSection.querySelector('#btn-add-target').onclick = () => handleAddTarget('quick-rfq-supplier');
            const pricingAddBtn = document.getElementById('btn-add-target-pricing');
            if (pricingAddBtn) pricingAddBtn.onclick = () => handleAddTarget('quick-rfq-supplier-pricing');

            supplierSection.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div class="item-detail-card-title" style="margin: 0;">Suppliers & Pricing</div>
                    <button id="btn-add-supplier" class="btn btn-primary" style="font-size: 11px; padding: 6px 12px;">+ Add Supplier</button>
                </div>
                <div id="suppliers-container"></div>
            `;
            tabBasic.appendChild(supplierSection);
            // Clone for Pricing tab
            const supplierClone = supplierSection.cloneNode(true);
            supplierClone.id = 'supplier-section-pricing';
            supplierClone.querySelector('#suppliers-container').id = 'suppliers-container-pricing';
            const clonedAddBtn = supplierClone.querySelector('#btn-add-supplier');
            if (clonedAddBtn) clonedAddBtn.id = 'btn-add-supplier-pricing';
            tabPricing.appendChild(supplierClone);
            renderSuppliers();

            // Add Supplier Handler - shared function
            const handleAddSupplier = () => {
                const newSup = { id: Date.now(), name: '', currency: 'EUR', isMain: item.suppliers.length === 0 };
                openSupplierModal(newSup, (savedSup) => {
                    item.suppliers.push(savedSup);
                    if (savedSup.isMain) {
                        item.supplier = savedSup.name;
                        item.price_1 = savedSup.price;
                        item.currency = savedSup.currency;
                        calculateEuroValues(item);
                    }
                    updateProject(currentProject);
                    renderSuppliers();
                    recalculateDetailEuro();
                }, item);
            };

            supplierSection.querySelector('#btn-add-supplier').addEventListener('click', handleAddSupplier);
            const pricingSupplierBtn = document.getElementById('btn-add-supplier-pricing');
            if (pricingSupplierBtn) pricingSupplierBtn.addEventListener('click', handleAddSupplier);


            // 3.5. Supplier Quotes & Documents Section
            
// 3.4 RFQ Bundles (link Item quoting to Quoting Process) - Card style
const bundlesSection = document.createElement('div');
bundlesSection.className = 'item-detail-card';
bundlesSection.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div class="item-detail-card-title" style="margin: 0;">RFQ Bundles for this Item</div>
        <button id="btn-create-bundle-from-item" class="btn btn-primary" style="font-size: 11px;">+ Create RFQ</button>
    </div>
    <div id="item-bundles-list"></div>
`;
tabPricing.appendChild(bundlesSection);

const renderItemBundles = () => {
    const host = bundlesSection.querySelector('#item-bundles-list');
    if (!host) return;
    const dn = String(item.item_drawing_no || '').trim();
    if (!dn || !currentProject) {
        host.innerHTML = '<div style="font-size:12px; color:#777;">No RFQ bundles yet.</div>';
        return;
    }
    const allBatches = (window.RFQData && typeof window.RFQData.getRFQBatches === 'function')
        ? (window.RFQData.getRFQBatches(currentProject.id) || [])
        : (currentProject.rfqBatches || currentProject.rfq_batches || []);
    const related = (Array.isArray(allBatches) ? allBatches : [])
        .filter(b => Array.isArray(b.items) && b.items.some(x => String(x.drawing_no || '').trim() === dn))
        .sort((a,b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
    if (related.length === 0) {
        host.innerHTML = '<div style="font-size:12px; color:#777;">No RFQ bundles yet.</div>';
        return;
    }
    host.innerHTML = related.map(b => {
        const st = escapeHtml(String(b.status || 'Draft'));
        const sup = escapeHtml(String(b.supplier_name || b.supplier || ''));
        const due = b.due_date ? ` • Due: ${escapeHtml(String(b.due_date))}` : '';
        return `
            <div class="bundle-row" data-bundle-id="${escapeHtml(String(b.id))}"
                 style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:10px; border:1px solid #e5e5e5; border-radius:12px; background:#fff; margin-bottom:8px; cursor:pointer;">
                <div style="display:flex; flex-direction:column; gap:2px;">
                    <div style="font-weight:800; font-size:12px;">${sup || '(Supplier)'} <span style="font-size:11px; color:#666; font-weight:700;">(${st})</span></div>
                    <div style="font-size:11px; color:#666;">${escapeHtml(String(b.created_at || '').split('T')[0] || '')}${due}</div>
                </div>
                <div style="display:flex; gap:6px;">
                    <button type="button" class="btn-secondary btn-mini" data-action="open">Open</button>
                </div>
            </div>
        `;
    }).join('');
    host.querySelectorAll('.bundle-row').forEach(row => {
        row.addEventListener('click', () => {
            const id = row.dataset.bundleId;
            switchView('quoting');
            if (typeof openRFQBatchDetail === 'function') openRFQBatchDetail(id);
            else if (typeof openBatchDetail === 'function') openBatchDetail(id);
        });
    });
};
renderItemBundles();

bundlesSection.querySelector('#btn-create-bundle-from-item').onclick = () => {
    const dn = String(item.item_drawing_no || '').trim();
    if (!dn) return;
    const prefSup = (item.suppliers && item.suppliers[0] && item.suppliers[0].name) ? item.suppliers[0].name : '';
    switchView('quoting');
    startRFQWizard(prefSup || undefined, [dn]);
};

const quotesSection = document.createElement('div');
            quotesSection.className = 'item-detail-card';

            // Initialize supplier_quotes array if missing
            if (!item.supplier_quotes) {
                item.supplier_quotes = [];
            }

            const renderQuotes = () => {
                const container = quotesSection.querySelector('#quotes-container');
                if (!container) return;

                // Group quotes by supplier
                const quotesBySupplier = {};
                item.supplier_quotes.forEach(quote => {
                    const supplierName = quote.supplier_name || 'Unknown';
                    if (!quotesBySupplier[supplierName]) {
                        quotesBySupplier[supplierName] = [];
                    }
                    quotesBySupplier[supplierName].push(quote);
                });

                const html = Object.entries(quotesBySupplier).map(([supplierName, quotes]) => `
                    <div style="margin-bottom: 16px; padding: 12px; background: #f9f9f9; border-radius: 8px; border-left: 3px solid #007AFF;">
                        <div style="font-weight: 600; margin-bottom: 8px; color: #007AFF;">📄 ${supplierName}</div>
                        ${quotes.map((quote, idx) => {
                    const globalIdx = item.supplier_quotes.indexOf(quote);
                    const uploadDate = quote.upload_date ? new Date(quote.upload_date).toLocaleDateString() : 'Unknown';
                    return `
                                <div style="display: flex; align-items: center; gap: 10px; padding: 6px; background: white; border-radius: 4px; margin-bottom: 4px;">
                                    <div style="flex: 1; font-size: 12px;">
                                        <div style="font-weight: 500;">${quote.filename}</div>
                                        <div style="color: #888; font-size: 10px;">${uploadDate}${quote.notes ? ' • ' + quote.notes : ''}</div>
                                    </div>
                                    <button class="btn-download-quote" data-idx="${globalIdx}" style="background: #007AFF; color: white; border: none; padding: 4px 10px; border-radius: 4px; font-size: 11px; cursor: pointer;">⬇ Download</button>
                                    <button class="btn-delete-quote" data-idx="${globalIdx}" style="background: #ff3b30; color: white; border: none; padding: 4px 10px; border-radius: 4px; font-size: 11px; cursor: pointer;">× Delete</button>
                                </div>
                            `;
                }).join('')}
                        <button class="btn-upload-quote" data-supplier="${supplierName}" style="background: #34c759; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; margin-top: 8px;">+ Upload Quote for ${supplierName}</button>
                    </div>
                `).join('');

                container.innerHTML = html || '<div style="text-align: center; color: #999; padding: 20px;">No quotes uploaded yet</div>';

                // Attach download handlers
                container.querySelectorAll('.btn-download-quote').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const idx = parseInt(e.currentTarget.dataset.idx);
                        const quote = item.supplier_quotes[idx];
                        if (!quote) return;

                        const link = document.createElement('a');
                        link.href = quote.data;
                        link.download = quote.filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });
                });

                // Attach delete handlers
                container.querySelectorAll('.btn-delete-quote').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        if (!confirm('Delete this quote?')) return;
                        const idx = parseInt(e.currentTarget.dataset.idx);
                        item.supplier_quotes.splice(idx, 1);
                        updateProject(currentProject);
                        renderQuotes();
                    });
                });

                // Attach upload handlers
                container.querySelectorAll('.btn-upload-quote').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const supplierName = e.currentTarget.dataset.supplier;
                        uploadQuoteForSupplier(supplierName);
                    });
                });
            };

            const uploadQuoteForSupplier = (supplierName) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    // Check file size (max 10MB)
                    if (file.size > 10 * 1024 * 1024) {
                        alert('File too large! Maximum size is 10MB.');
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        const supplier = item.suppliers?.find(s => s.name === supplierName);
                        const newQuote = {
                            id: Date.now(),
                            supplier_id: supplier?.id || Date.now(),
                            supplier_name: supplierName,
                            filename: file.name,
                            data: ev.target.result,
                            upload_date: new Date().toISOString(),
                            notes: ''
                        };
                        item.supplier_quotes.push(newQuote);
                        updateProject(currentProject);
                        renderQuotes();
                    };
                    reader.readAsDataURL(file);
                };
                input.click();
            };

            quotesSection.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div class="item-detail-card-title" style="margin: 0;">Supplier Quotes & Documents</div>
                    <button id="btn-upload-quote-general" class="btn btn-primary" style="font-size: 11px;">+ Upload Quote</button>
                </div>
                <div id="quotes-container"></div>
            `;
            tabPricing.appendChild(quotesSection);
            renderQuotes();

            // General upload button handler (with supplier selection)
            quotesSection.querySelector('#btn-upload-quote-general').addEventListener('click', () => {
                if (!item.suppliers || item.suppliers.length === 0) {
                    alert('Please add at least one supplier first!');
                    return;
                }

                // If only one supplier, upload directly
                if (item.suppliers.length === 1) {
                    uploadQuoteForSupplier(item.suppliers[0].name);
                    return;
                }

                // Create modal for supplier selection
                const modal = document.createElement('div');
                modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';

                const content = document.createElement('div');
                content.style.cssText = 'background: white; padding: 24px; border-radius: 12px; width: 400px; max-width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.3);';

                content.innerHTML = `
                    <h3 style="margin-top: 0; margin-bottom: 16px;">Select Supplier for Quote</h3>
                    <select id="supplier-select" class="macos-input" style="width: 100%; margin-bottom: 20px;">
                        ${item.suppliers.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
                    </select>
                    </div>

                <div id="sup-tab-nda" class="hidden">
                    <h4 style="margin: 0 0 12px 0; font-size: 13px; color: #666;">🔒 NDA</h4>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom: 14px;">
                        <div class="form-row" style="grid-column:1/-1; display:flex; align-items:center; gap:10px;">
                            <input type="checkbox" id="sup-nda-signed" style="transform:scale(1.1);">
                            <label for="sup-nda-signed" style="margin:0; font-weight:600;">NDA signed</label>
                        </div>
                        <div class="form-row"><label>Signed date</label><input type="date" class="macos-input" id="sup-nda-date"></div>
                        <div class="form-row"><label>Storage / Link</label><input class="macos-input" id="sup-nda-storage" placeholder="e.g. SharePoint link, folder path"></div>
                    </div>
                    <div class="form-row"><label>Notes</label><textarea class="macos-input" id="sup-master-notes" rows="3" placeholder="NDA notes, legal contact, etc."></textarea></div>
                </div>

                <div id="sup-tab-custom" class="hidden">
                    <h4 style="margin: 0 0 12px 0; font-size: 13px; color: #666;">🧩 Custom Fields</h4>
                    <div style="display:flex; gap:8px; margin-bottom:12px;">
                        <input class="macos-input" id="sup-custom-key" placeholder="Field name" style="flex:1;">
                        <input class="macos-input" id="sup-custom-val" placeholder="Value" style="flex:2;">
                        <button type="button" class="macos-btn" id="sup-custom-add" style="background:#34c759;color:#fff;">+ Add</button>
                    </div>
                    <div id="sup-custom-list" style="display:flex; flex-direction:column; gap:8px;"></div>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                        <button id="btn-cancel-upload" class="macos-btn" style="background: #ccc;">Zrušit</button>
                        <button id="btn-upload-confirm" class="macos-btn" style="background: #34c759; color: white;">Upload Quote</button>
                    </div>
                `;

                modal.appendChild(content);
                document.body.appendChild(modal);

                content.querySelector('#btn-cancel-upload').onclick = () => document.body.removeChild(modal);
                content.querySelector('#btn-upload-confirm').onclick = () => {
                    const selectedSupplier = content.querySelector('#supplier-select').value;
                    document.body.removeChild(modal);
                    uploadQuoteForSupplier(selectedSupplier);
                };
            });


            // 4. Calculated Values
            const calcSection = document.createElement('div');
            calcSection.className = 'item-detail-card';
            calcSection.innerHTML = `<div class="item-detail-card-title">Calculated EUR Values</div><div id="calc-values-grid" class="detail-grid"></div>`;
            tabPricing.appendChild(calcSection);

            window.recalculateDetailEuro = () => {
                const grid = calcSection.querySelector('#calc-values-grid');
                if (!grid) return;
                calculateEuroValues(item);
                const fields = [
                    { label: 'Price 1 (EUR)', val: item.price_1_euro },
                    { label: 'Shipping (EUR)', val: item.shipping_cost_euro },
                    { label: 'Additional (EUR)', val: item.additional_cost }
                ];
                grid.innerHTML = fields.map(f => `
                    <div class="form-row">
                        <label>${f.label}</label>
                        <input type="text" value="${f.val || ''}" readonly class="macos-input" style="background: #f5f5f7; color: #666;">
                    </div>
                `).join('');
            };
            recalculateDetailEuro();

            if (detailWindow && currentView !== 'item-detail') detailWindow.classList.remove('hidden');
        }

        function openSupplierModal(supplier, onUložit, item) {
    // Project-level supplier master (NDA + custom fields)
    let master = null;
    if (currentProject) {
        ensureProjectSuppliers(currentProject);
        master = supplier && supplier.master_id ? getSupplierMasterById(currentProject, supplier.master_id) : null;
        if (!master && supplier && supplier.name) master = getSupplierMasterByName(currentProject, supplier.name);
        if (!master && supplier && supplier.name) master = getOrCreateSupplierMaster(currentProject, supplier.name);
        if (master) linkItemSupplierToMaster(supplier, master);
    }

    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; z-index:10000;';

    const content = document.createElement('div');
    content.style.cssText = 'background:#fff; padding:22px; border-radius:14px; width:720px; max-width:96vw; max-height:92vh; overflow:auto; box-shadow: 0 10px 40px rgba(0,0,0,0.25);';

    // Dynamic price inputs based on item QTY tiers (qty_1..qty_N)
    const itemQtys = getItemQtyTiers(item, { includeBlanks: false });

    const existingPrices = Array.isArray(supplier.prices) ? supplier.prices : [];
    const getPriceForQty = (qty) => {
        const found = existingPrices.find(p => Number(p.qty) === Number(qty));
        return found ? (found.price ?? '') : '';
    };

    const { INCOTERMS } = window.RFQData || { INCOTERMS: [] };
    const incotermOptions = (INCOTERMS || []).map(term =>
        `<option value="${escapeHtml(term)}" ${supplier.incoterms === term ? 'selected' : ''}>${escapeHtml(term)}</option>`
    ).join('');

    const masterNda = (master && master.nda) ? master.nda : { signed: false, signed_date: '', storage: '' };
    const masterCustom = (master && Array.isArray(master.custom)) ? master.custom : [];
    const masterNotes = (master && master.notes) ? master.notes : '';

    content.innerHTML = `
        <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin-bottom:12px;">
            <div>
                <div style="font-weight:900; font-size:16px;">Supplier</div>
                <div style="font-size:12px; color:#666;">Item: <b>${escapeHtml(String(item.item_drawing_no || ''))}</b> • ${escapeHtml(String(item.description || '').slice(0, 60))}</div>
            </div>
            <button type="button" id="sup-close-x" class="macos-btn" style="background:#eee;">✕</button>
        </div>

        <div style="display:flex; gap:8px; margin-bottom:14px;">
            <button type="button" class="macos-btn sup-tab-btn" data-tab="quote" style="background:#007AFF;color:#fff;">Quote</button>
            <button type="button" class="macos-btn sup-tab-btn" data-tab="nda" style="background:#eee;">NDA</button>
            <button type="button" class="macos-btn sup-tab-btn" data-tab="custom" style="background:#eee;">Custom</button>
        </div>

        <div id="sup-tab-quote">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:14px;">
                <div class="form-row"><label>Name</label><input class="macos-input" id="sup-name" value="${escapeHtml(String(supplier.name || ''))}"></div>
                <div class="form-row">
                    <label>Currency</label>
                    <select class="macos-input" id="sup-curr">
                        <option value="EUR">EUR</option><option value="USD">USD</option><option value="CZK">CZK</option><option value="GBP">GBP</option>
                    </select>
                </div>
            </div>

            <h4 style="margin: 10px 0 10px 0; font-size: 13px; color: #666;">📅 RFQ Tracking</h4>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:14px;">
                <div class="form-row"><label>RFQ Sent Date</label><input type="date" class="macos-input" id="sup-rfq-sent" value="${escapeHtml(String(supplier.rfq_sent_date || ''))}"></div>
                <div class="form-row"><label>Quote Received Date</label><input type="date" class="macos-input" id="sup-quote-received" value="${escapeHtml(String(supplier.quote_received_date || ''))}"></div>
                <div class="form-row"><label>Quote Valid Until</label><input type="date" class="macos-input" id="sup-valid-until" value="${escapeHtml(String(supplier.quote_valid_until || ''))}"></div>
                <div class="form-row">
                    <label>Quote Status</label>
                    <select class="macos-input" id="sup-quote-status">
                        <option value="Pending" ${supplier.quote_status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Active" ${(supplier.quote_status === 'Active' || !supplier.quote_status) ? 'selected' : ''}>Active</option>
                        <option value="Expired" ${supplier.quote_status === 'Expired' ? 'selected' : ''}>Expired</option>
                        <option value="Won" ${supplier.quote_status === 'Won' ? 'selected' : ''}>Won</option>
                        <option value="Lost" ${supplier.quote_status === 'Lost' ? 'selected' : ''}>Lost</option>
                        <option value="No Bid" ${supplier.quote_status === 'No Bid' ? 'selected' : ''}>No Bid</option>
                    </select>
                </div>
            </div>

            <h4 style="margin: 10px 0 10px 0; font-size: 13px; color: #666;">💰 Pricing (based on item QTYs)</h4>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:14px;">
                ${itemQtys.length ? itemQtys.map(q => `
                    <div class="form-row">
                        <label>Price @${escapeHtml(String(q.value))}pc</label>
                        <input type="number" step="0.01" class="macos-input price-qty-input"
                               data-qty="${escapeHtml(String(q.value))}" data-qty-index="${q.index}"
                               value="${escapeHtml(String(getPriceForQty(q.value)))}"
                               placeholder="Price for ${escapeHtml(String(q.value))} pcs">
                    </div>
                `).join('') : `<div style="grid-column:1/-1; text-align:center; color:#888; padding:14px; border:1px dashed #ddd; border-radius:12px;">No QTY values defined on item.</div>`}
            </div>

            <h4 style="margin: 10px 0 10px 0; font-size: 13px; color: #666;">📋 Additional Info</h4>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:14px;">
                <div class="form-row"><label>MOQ</label><input class="macos-input" id="sup-moq" value="${escapeHtml(String(supplier.moq || ''))}"></div>
                <div class="form-row"><label>MOV</label><input class="macos-input" id="sup-mov" value="${escapeHtml(String(supplier.mov || ''))}"></div>
                <div class="form-row"><label>Quote Number</label><input class="macos-input" id="sup-quote" value="${escapeHtml(String(supplier.quote_number || ''))}"></div>
                <div class="form-row"><label>Lead Time</label><input class="macos-input" id="sup-lead" value="${escapeHtml(String(supplier.lead_time || ''))}" placeholder="e.g. 6-8 weeks"></div>
                <div class="form-row"><label>Shipping Cost</label><input type="number" step="0.01" class="macos-input" id="sup-ship" value="${escapeHtml(String(toNumberInputValue(supplier.shipping || '')))}"></div>
                <div class="form-row">
                    <label>Incoterms</label>
                    <select class="macos-input" id="sup-incoterms">
                        <option value="">-- Select --</option>
                        ${incotermOptions}
                    </select>
                </div>
            </div>
        </div>

        <div id="sup-tab-nda" class="hidden">
            <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #666;">🔒 NDA</h4>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:14px;">
                <div class="form-row" style="grid-column:1/-1; display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" id="sup-nda-signed" style="transform:scale(1.15);" ${masterNda.signed ? 'checked' : ''}>
                    <label for="sup-nda-signed" style="margin:0; font-weight:700;">NDA signed</label>
                </div>
                <div class="form-row"><label>Signed date</label><input type="date" class="macos-input" id="sup-nda-date" value="${escapeHtml(String(masterNda.signed_date || ''))}"></div>
                <div class="form-row"><label>Stored (link/path)</label><input class="macos-input" id="sup-nda-storage" placeholder="e.g. SharePoint URL / folder path" value="${escapeHtml(String(masterNda.storage || ''))}"></div>
            </div>
            <div class="form-row">
                <label>Supplier notes</label>
                <textarea class="macos-input" id="sup-master-notes" rows="4" placeholder="Supplier master notes...">${escapeHtml(String(masterNotes || ''))}</textarea>
            </div>
        </div>

        <div id="sup-tab-custom" class="hidden">
            <h4 style="margin: 0 0 10px 0; font-size: 13px; color: #666;">➕ Custom fields (supplier master)</h4>
            <div style="display:grid; grid-template-columns: 1fr 1fr auto; gap:10px; margin-bottom:12px;">
                <input class="macos-input" id="sup-custom-key" placeholder="Field name (e.g. Payment Terms)">
                <input class="macos-input" id="sup-custom-val" placeholder="Value (e.g. Net 60)">
                <button type="button" id="sup-custom-add" class="macos-btn" style="background:#34c759; color:#fff;">Add</button>
            </div>
            <div id="sup-custom-list" style="display:flex; flex-direction:column; gap:8px;">
                ${masterCustom.length ? masterCustom.map((r, idx) => `
                    <div style="display:flex; gap:8px; align-items:center; padding:8px; border:1px solid #e5e5e5; border-radius:10px; background:#fff;">
                        <div style="flex:1; font-size:12px;">
                            <b>${escapeHtml(String(r.key || ''))}</b>
                            <div style="color:#666; font-size:11px;">${escapeHtml(String(r.value || ''))}</div>
                        </div>
                        <button type="button" class="btn-danger btn-mini sup-custom-del" data-idx="${idx}">Remove</button>
                    </div>
                `).join('') : `<div style="font-size:12px; color:#777;">No custom fields yet.</div>`}
            </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
            <button type="button" id="btn-cancel" class="macos-btn" style="background:#ccc;">Zrušit</button>
            <button type="button" id="btn-save" class="macos-btn" style="background:#007AFF; color:#fff;">Uložit</button>
        </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    const close = () => { if (modal.parentNode) document.body.removeChild(modal); };
    content.querySelector('#sup-close-x').onclick = close;
    content.querySelector('#btn-cancel').onclick = close;

    // Init currency select
    content.querySelector('#sup-curr').value = supplier.currency || 'EUR';

    // Custom rows state
    let customRows = (master && Array.isArray(master.custom)) ? [...master.custom] : [];
    const customListEl = content.querySelector('#sup-custom-list');
    const renderCustom = () => {
        if (!customListEl) return;
        if (!customRows.length) {
            customListEl.innerHTML = '<div style="font-size:12px; color:#777;">No custom fields yet.</div>';
            return;
        }
        customListEl.innerHTML = customRows.map((r, idx) => `
            <div style="display:flex; gap:8px; align-items:center; padding:8px; border:1px solid #e5e5e5; border-radius:10px; background:#fff;">
                <div style="flex:1; font-size:12px;">
                    <b>${escapeHtml(String(r.key || ''))}</b>
                    <div style="color:#666; font-size:11px;">${escapeHtml(String(r.value || ''))}</div>
                </div>
                <button type="button" class="btn-danger btn-mini sup-custom-del" data-idx="${idx}">Remove</button>
            </div>
        `).join('');
    };

    const addCustomBtn = content.querySelector('#sup-custom-add');
    if (addCustomBtn) {
        addCustomBtn.onclick = () => {
            const k = (content.querySelector('#sup-custom-key').value || '').trim();
            const v = (content.querySelector('#sup-custom-val').value || '').trim();
            if (!k) return;
            customRows.push({ key: k, value: v });
            content.querySelector('#sup-custom-key').value = '';
            content.querySelector('#sup-custom-val').value = '';
            renderCustom();
        };
    }
    if (customListEl) {
        customListEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.sup-custom-del');
            if (!btn) return;
            const idx = parseInt(btn.dataset.idx);
            if (Number.isNaN(idx)) return;
            customRows.splice(idx, 1);
            renderCustom();
        });
    }

    // Tabs
    const tabBtns = content.querySelectorAll('.sup-tab-btn');
    const tabQuote = content.querySelector('#sup-tab-quote');
    const tabNda = content.querySelector('#sup-tab-nda');
    const tabCustom = content.querySelector('#sup-tab-custom');
    const setTab = (name) => {
        const map = { quote: tabQuote, nda: tabNda, custom: tabCustom };
        Object.entries(map).forEach(([k, el]) => {
            if (!el) return;
            if (k === name) el.classList.remove('hidden');
            else el.classList.add('hidden');
        });
        tabBtns.forEach(b => {
            const active = b.dataset.tab === name;
            b.style.background = active ? '#007AFF' : '#eee';
            b.style.color = active ? '#fff' : '#000';
        });
    };
    tabBtns.forEach(b => b.onclick = () => setTab(b.dataset.tab));
    setTab('quote');

    // Uložit handler
    content.querySelector('#btn-save').onclick = () => {
        const ndaSigned = !!(content.querySelector('#sup-nda-signed') && content.querySelector('#sup-nda-signed').checked);
        const ndaDate = content.querySelector('#sup-nda-date') ? content.querySelector('#sup-nda-date').value : '';
        const ndaStorage = content.querySelector('#sup-nda-storage') ? content.querySelector('#sup-nda-storage').value : '';
        const masterNotes = content.querySelector('#sup-master-notes') ? content.querySelector('#sup-master-notes').value : '';

        // Prices array
        const priceInputs = content.querySelectorAll('.price-qty-input');
        const prices = [];
        priceInputs.forEach(input => {
            const qty = parseFloat(input.dataset.qty);
            const price = String(input.value || '').trim();
            if (price !== '') prices.push({ qty: qty, price: price });
        });

        const updated = {
            ...supplier,
            master_id: supplier.master_id || (master ? master.id : undefined),
            name: String(content.querySelector('#sup-name').value || '').trim(),
            currency: content.querySelector('#sup-curr').value,
            prices: prices,
            rfq_sent_date: content.querySelector('#sup-rfq-sent').value,
            quote_received_date: content.querySelector('#sup-quote-received').value,
            quote_valid_until: content.querySelector('#sup-valid-until').value,
            quote_status: content.querySelector('#sup-quote-status').value,
            moq: content.querySelector('#sup-moq').value,
            mov: content.querySelector('#sup-mov').value,
            quote_number: content.querySelector('#sup-quote').value,
            shipping: content.querySelector('#sup-ship').value,
            lead_time: content.querySelector('#sup-lead').value,
            incoterms: content.querySelector('#sup-incoterms').value
        };

        // Mirror prices into legacy/index fields (price_1..price_N + price alias)
        priceInputs.forEach(input => {
            const idx = Number(input.dataset.qtyIndex);
            if (!Number.isFinite(idx) || idx <= 0) return;
            const price = String(input.value || '').trim();
            setSupplierPriceByIndex(updated, idx, price);
        });
        // ensure aliases
        if (updated.price_1 !== undefined && updated.price === undefined) updated.price = updated.price_1;
        if (updated.price === undefined && updated.price_1 !== undefined) updated.price = updated.price_1;


        // Sync master supplier
        if (currentProject && updated.name) {
            let mRec = updated.master_id ? getSupplierMasterById(currentProject, updated.master_id) : null;
            if (!mRec) mRec = getSupplierMasterByName(currentProject, updated.name);
            if (!mRec) mRec = getOrCreateSupplierMaster(currentProject, updated.name);
            if (mRec) {
                mRec.name = updated.name;
                mRec.nda = { signed: ndaSigned, signed_date: ndaDate, storage: ndaStorage };
                mRec.custom = Array.isArray(customRows) ? customRows : [];
                mRec.notes = masterNotes;
                upsertSupplierMaster(currentProject, mRec);
                updated.master_id = mRec.id;
                updateProject(currentProject);
            }
        }

        onUložit(updated);
        close();
    };
}

        function exportSingleItem(item) {
            if (typeof XLSX === 'undefined') { alert('Excel lib missing'); return; }

            const data = [];
            data.push(['Item Details']);
            data.push(['Line', 'Drawing No', 'Description', 'Manufacturer', 'MPN']);
            data.push([item.line, item.item_drawing_no, item.description, item.manufacturer, item.mpn]);
            data.push([]);

            data.push(['Supplier Quotes']);
            data.push(['Supplier', 'Currency', 'Price 1', 'Price 2', 'Price 3', 'Price 4', 'Price 5', 'Shipping', 'Lead Time', 'MOQ', 'Incoterms', 'Is Main']);

            (item.suppliers || []).forEach(s => {
                data.push([
                    s.name, s.currency, s.price, s.price_2, s.price_3, s.price_4, s.price_5,
                    s.shipping, s.lead_time, s.moq, s.incoterms, s.isMain ? 'Yes' : 'No'
                ]);
            });

            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Item Export");
            XLSX.writeFile(wb, `Item_${item.item_drawing_no || 'Unknown'}_Export.xlsx`);
        }

        function getActiveItemDetailRoot() {
            const page = getEl('item-detail-page-content');
            if (page && currentView === 'item-detail') return page;
            return detailContent;
        }

        function saveDetailChanges(shouldClose = true) {
            if (currentDetailIndex === null) return;
            const liveItem = currentProject && currentProject.items ? currentProject.items[currentDetailIndex] : null;
            if (!liveItem) return;

            const item = { ...liveItem };
            const root = getActiveItemDetailRoot();

            const inputs = root.querySelectorAll('input[data-key], select[data-key], textarea[data-key]');
            inputs.forEach(input => {
                if (input.dataset.key) item[input.dataset.key] = input.value;
            });

            // Preserve rich fields edited via dedicated UIs
            item.suppliers = liveItem.suppliers;
            item.comments = liveItem.comments;
            item.attachments = liveItem.attachments;
            item.image = liveItem.image;
            item.issueHistory = liveItem.issueHistory;

            // Keep logic consistent across app
            syncSupplierPricingToQtyTiers(item);
            syncBundlesQtyFromItem(currentProject, item);

            calculateEuroValues(item);
            currentProject.items[currentDetailIndex] = item;
            updateProject(currentProject);

            // Refresh tables / stats
            renderCompactTable();
            updateStats();
            updateSupplierFilter();
            updateManufacturerFilter();
            if (currentView === 'dashboard') renderDashboard();

            if (shouldClose) {
                closeDetailWindow();
            }
        }

        function closeDetailWindow() {
            // Hide legacy overlay if present
            if (detailWindow) detailWindow.classList.add('hidden');

            const isDetailVisible = (viewItemDetail && !viewItemDetail.classList.contains('hidden'));
            const wasDetailView = (currentView === 'item-detail') || isDetailVisible;

            currentDetailIndex = null;

            if (wasDetailView) {
                const ret = itemDetailReturnView || 'items';
                if (typeof switchView === 'function') switchView(ret);
                // Ensure tables refresh after returning
                try { if (ret === 'items' && typeof renderItemsTable === 'function') renderItemsTable(); } catch (e) {}
            }
        }

        function deleteCurrentItem() {
            if (currentDetailIndex === null) return;
            if (!confirm('Are you sure you want to delete this item?')) return;
            currentProject.items.splice(currentDetailIndex, 1);
            updateProject(currentProject);
            renderCompactTable();
            updateStats();
            renderSidebar();
            updateSupplierFilter();
            if (currentView === 'dashboard') renderDashboard();
            closeDetailWindow();
        }

        // Ensure XLSX library is available (Excel import/export)
        function ensureXLSXLoaded(callback) {
            try {
                if (typeof XLSX !== 'undefined') { callback(true); return; }
                // avoid double-loading
                const existing = document.querySelector('script[data-xlsx-lib="1"]');
                if (existing) {
                    existing.addEventListener('load', () => callback(typeof XLSX !== 'undefined'), { once: true });
                    existing.addEventListener('error', () => callback(false), { once: true });
                    return;
                }
                const s = document.createElement('script');
                s.dataset.xlsxLib = '1';
                s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
                s.onload = () => callback(typeof XLSX !== 'undefined');
                s.onerror = () => callback(false);
                document.head.appendChild(s);
            } catch (e) {
                callback(false);
            }
        }

        function exportToExcel() {
            if (!currentProject || !currentProject.items || currentProject.items.length === 0) {
                alert('No data to export!');
                return;
            }
            if (typeof XLSX === 'undefined') {
                ensureXLSXLoaded((ok) => {
                    if (!ok) {
                        exportToCSVItems();
                        alert('XLSX not available. Exported CSV instead (works offline).');
                        return;
                    }
                    exportToExcel();
                });
                return;
            }
            const data = currentProject.items.map(item => {
                const row = {};
                FIELDS.forEach(field => { row[field.label] = item[field.key] || ''; });
                return row;
            });
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "RFQ Data");
            const filename = `${currentProject.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
            XLSX.writeFile(wb, filename);
        }

        function exportToCSVItems() {
            if (!currentProject || !Array.isArray(currentProject.items) || currentProject.items.length === 0) {
                alert('No data to export!');
                return;
            }
            const headers = FIELDS.map(f => f.label);
            const rows = currentProject.items.map(item => FIELDS.map(f => item[f.key] ?? ''));
            const esc = (v) => {
                const s = String(v ?? '');
                return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
            };
            const csv = [headers.map(esc).join(','), ...rows.map(r => r.map(esc).join(','))].join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${(currentProject.name || 'Project').replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().slice(0,10)}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function handleImportExcel(e) {
            const file = e.target.files && e.target.files[0];
            if (!file) return;

            const name = String(file.name || '').toLowerCase();
            const ext = (name.split('.').pop() || '').trim();

            // CSV / TSV import works even without XLSX (offline-friendly)
            const importDelimited = (delimiter) => {
                const reader = new FileReader();
                reader.onload = function (ev) {
                    const text = String(ev.target.result || '');
                    const lines = text.split(/\r?\n/).filter(l => l && l.trim() !== '');
                    if (lines.length < 2) {
                        alert('CSV/TSV file is empty or invalid.');
                        fileImportExcel.value = '';
                        return;
                    }

                    const splitLine = (line) => {
                        const out = [];
                        let cur = '';
                        let inQ = false;
                        for (let i = 0; i < line.length; i++) {
                            const ch = line[i];
                            if (ch === '"') {
                                if (inQ && line[i + 1] === '"') { cur += '"'; i++; continue; }
                                inQ = !inQ;
                                continue;
                            }
                            if (!inQ && ch === delimiter) { out.push(cur); cur = ''; continue; }
                            cur += ch;
                        }
                        out.push(cur);
                        return out;
                    };

                    const headers = splitLine(lines[0]).map(h => String(h || '').trim());
                    const rows = lines.slice(1).map(splitLine);

                    const headerMap = {};
                    headers.forEach((header, index) => {
                        if (!header) return;
                        const headerStr = String(header).toLowerCase().trim().replace(/[\s:\n]/g, '');
                        const field = FIELDS.find(f => {
                            const labelNorm = f.label.toLowerCase().replace(/[\s:\n]/g, '');
                            return labelNorm === headerStr;
                        });
                        if (field) headerMap[index] = field.key;
                    });

                    let importedCount = 0;
                    rows.forEach(row => {
                        if (!row || row.every(cell => !cell)) return;
                        const item = {};
                        row.forEach((cell, index) => {
                            const key = headerMap[index];
                            if (key) item[key] = cell || '';
                        });
                        if (Object.keys(item).length > 0) {
                            calculateEuroValues(item);
                            if (!currentProject.items) currentProject.items = [];
                            currentProject.items.push(item);
                            importedCount++;
                        }
                    });

                    fileImportExcel.value = '';
                    updateProject(currentProject);
                    renderCompactTable();
                    updateStats();
                    renderSidebar();
                    updateSupplierFilter();
                    alert(`Imported ${importedCount} rows successfully!`);
                    if (currentView === 'dashboard') renderDashboard();
                };
                reader.readAsText(file, 'utf-8');
            };

            if (ext === 'csv') return importDelimited(',');
            if (ext === 'tsv' || ext === 'txt') return importDelimited('\t');

            // XLSX import (requires XLSX library)
            if (typeof XLSX === 'undefined') {
                ensureXLSXLoaded((ok) => {
                    if (!ok) {
                        alert('Excel (XLSX) library not loaded. Tip: save your sheet as CSV and import it (CSV import works offline).');
                        fileImportExcel.value = '';
                        return;
                    }
                    // retry import after library loads
                    handleImportExcel(e);
                });
                return;
            }

            const reader = new FileReader();
            reader.onload = function (ev) {
                const data = new Uint8Array(ev.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                if (!jsonData || jsonData.length < 2) {
                    alert('Excel file is empty or invalid format.');
                    fileImportExcel.value = '';
                    return;
                }

                const headers = jsonData[0];
                const rows = jsonData.slice(1);
                const headerMap = {};
                headers.forEach((header, index) => {
                    if (!header) return;
                    const headerStr = String(header).toLowerCase().trim().replace(/[\s:\n]/g, '');
                    const field = FIELDS.find(f => {
                        const labelNorm = f.label.toLowerCase().replace(/[\s:\n]/g, '');
                        return labelNorm === headerStr;
                    });
                    if (field) headerMap[index] = field.key;
                });

                let importedCount = 0;
                rows.forEach(row => {
                    if (!row || row.every(cell => !cell)) return;
                    const item = {};
                    row.forEach((cell, index) => {
                        const key = headerMap[index];
                        if (key) item[key] = cell || '';
                    });
                    if (Object.keys(item).length > 0) {
                        calculateEuroValues(item);
                        if (!currentProject.items) currentProject.items = [];
                        currentProject.items.push(item);
                        importedCount++;
                    }
                });

                fileImportExcel.value = '';
                updateProject(currentProject);
                renderCompactTable();
                updateStats();
                renderSidebar();
                updateSupplierFilter();
                alert(`Imported ${importedCount} rows successfully!`);
                if (currentView === 'dashboard') renderDashboard();
            };
            reader.readAsArrayBuffer(file);
        }

        // --- NEW HELPER FUNCTIONS ---

        window.openItemInProject = (projectId, itemNo) => {
            switchView('items');
            if (currentProject.id !== projectId) {
                const proj = projects.find(p => p.id === projectId);
                if (proj) openProject(proj);
            }
            const index = currentProject.items.findIndex(i => i.item_drawing_no === itemNo);
            if (index !== -1) {
                openDetailWindow(index);
            } else {
                alert('Item not found in this project');
            }
        };

        window.bulkUpdateSupplier = (supplierName, type, value) => {
            if (!confirm(`Are you sure you want to update all items for ${supplierName}?`)) return;

            let count = 0;
            currentProject.items.forEach(item => {
                if (item.suppliers && Array.isArray(item.suppliers)) {
                    const s = item.suppliers.find(sup => sup.name === supplierName);
                    if (s) {
                        if (type === 'main') {
                            if (value === true) {
                                item.suppliers.forEach(sup => sup.isMain = false);
                                s.isMain = true;
                                item.supplier = s.name;
                                item.price_1 = s.price;
                                item.currency = s.currency;
                                calculateEuroValues(item);
                            }
                        } else if (type === 'feedback') {
                            s.feedback = value;
                        }
                        count++;
                    }
                } else if (item.supplier === supplierName) {
                    if (type === 'main') {
                        item.supplier_is_main = value;
                    } else if (type === 'feedback') {
                        item.supplier_feedback = value;
                    }
                    count++;
                }
            });

            updateProject(currentProject);
            if (typeof window.openSupplierDetail === 'function') window.openSupplierDetail(supplierName);
            if (typeof renderSuppliers === 'function') renderSuppliers();
            alert(`Updated ${count} items.`);
        };

        // --- BULK ITEM ACTIONS ---

        function updateBulkActionBar() {
            const bar = getEl('bulk-action-bar');
            const countEl = getEl('bulk-count');
            if (!bar || !countEl) return;

            if (selectedItems.size > 0) {
                bar.classList.remove('hidden');
                countEl.textContent = selectedItems.size;
            } else {
                bar.classList.add('hidden');
            }
        }

        function updateMasterCheckboxState() {
            const selectAllCheck = getEl('select-all-items');
            if (!selectAllCheck || !dataTableBody) return;

            const rows = Array.from(dataTableBody.querySelectorAll('tr'));
            const visibleRows = rows.filter(row => row.style.display !== 'none');

            if (visibleRows.length === 0) {
                selectAllCheck.checked = false;
                selectAllCheck.indeterminate = false;
                return;
            }

            const selectedVisible = visibleRows.filter(row => {
                const index = parseInt(row.dataset.index);
                return selectedItems.has(index);
            });

            if (selectedVisible.length === visibleRows.length) {
                selectAllCheck.checked = true;
                selectAllCheck.indeterminate = false;
            } else if (selectedVisible.length > 0) {
                selectAllCheck.checked = false;
                selectAllCheck.indeterminate = true;
            } else {
                selectAllCheck.checked = false;
                selectAllCheck.indeterminate = false;
            }
        }

        function handleSelectionChange(index, checked) {
            index = parseInt(index);
            if (checked) {
                selectedItems.add(index);
            } else {
                selectedItems.delete(index);
            }
            updateBulkActionBar();
            updateMasterCheckboxState();
        }

        function toggleAllItems(checked) {
            if (!dataTableBody) return;
            const rows = dataTableBody.querySelectorAll('tr');

            rows.forEach(row => {
                if (row.style.display !== 'none') {
                    const checkbox = row.querySelector('.item-checkbox');
                    const index = parseInt(row.dataset.index);
                    if (checkbox) {
                        checkbox.checked = checked;
                    }
                    if (checked) selectedItems.add(index);
                    else selectedItems.delete(index);
                }
            });
            updateBulkActionBar();
            updateMasterCheckboxState();
        }

        function handleBulkStatusChange(newStatus) {
            if (!newStatus) return;

            // Get selected indices from SuperTable or fallback to selectedItems
            let selectedIndices = [];
            if (itemsSuperTable) {
                selectedIndices = itemsSuperTable.getSelectedIndices();
            } else {
                selectedIndices = Array.from(selectedItems);
            }

            if (selectedIndices.length === 0) return;

            if (!confirm(`Change status to "${newStatus}" for ${selectedIndices.length} items?`)) {
                const sel = getEl('bulk-status-select');
                if (sel) sel.value = '';
                return;
            }

            let count = 0;
            selectedIndices.forEach(index => {
                if (currentProject.items[index]) {
                    currentProject.items[index].status = newStatus;
                    count++;
                }
            });

            updateProject(currentProject);

            // Refresh SuperTable
            if (itemsSuperTable) {
                itemsSuperTable.clearSelection();
                itemsSuperTable.setData(currentProject.items);
            }

            updateStats();

            const sel = getEl('bulk-status-select');
            if (sel) sel.value = '';

            // Hide bulk bar
            const bulkBar = document.getElementById('bulk-action-bar');
            if (bulkBar) bulkBar.classList.add('hidden');

            if (currentView === 'dashboard') renderDashboard();
        }

        function handleBulkExport() {
            // Get selected items from SuperTable or fallback to selectedItems
            let itemsToExport = [];
            if (itemsSuperTable) {
                itemsToExport = itemsSuperTable.getSelectedItems();
            } else {
                selectedItems.forEach(index => {
                    if (currentProject.items[index]) itemsToExport.push(currentProject.items[index]);
                });
            }

            if (itemsToExport.length === 0) return;

            if (typeof XLSX === 'undefined') {
                alert('Excel library not loaded. Fix: include XLSX (xlsx.full.min.js) or open with internet (CDN).');
                return;
            }

            const data = itemsToExport.map(item => {
                const row = {};
                FIELDS.forEach(field => { row[field.label] = item[field.key] || ''; });
                row['Status'] = item.status || 'New';
                return row;
            });

            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Selected Items");
            const filename = `Export_${currentProject.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
            XLSX.writeFile(wb, filename);
        }

        function getSupplierData(supplierName) {
            if (!currentProject.supplierData) {
                currentProject.supplierData = {};
            }
            if (!currentProject.supplierData[supplierName]) {
                currentProject.supplierData[supplierName] = {
                    contact: { name: '', email: '', phone: '', address: '', website: '' },
                    notes: [],
                    rating: 0,
                    status: 'Active'
                };
            }
            return currentProject.supplierData[supplierName];
        }

        function saveSupplierData(supplierName, data) {
            if (!currentProject.supplierData) currentProject.supplierData = {};
            currentProject.supplierData[supplierName] = data;
            updateProject(currentProject);
        }

        // --- ENHANCED SUPPLIER DETAIL ---

        window.openSupplierDetail = (supplierName) => {
            // Use full-page view with new design
            const prevView = currentView;
            if (prevView && prevView !== 'supplier-detail') {
                supplierDetailReturnView = prevView;
            }
            switchView('supplier-detail');
            renderSupplierDetail(supplierName);
        };

        // Legacy popup support (hidden, kept for compatibility)
        window.openSupplierDetailPopup = (supplierName) => {
            const supplierDetailWindow = getEl('supplier-detail-window');
            const content = getEl('supplier-detail-content');
            const btnClose = getEl('btn-close-supplier-detail');

            if (!supplierDetailWindow || !content) return;

            supplierDetailWindow.classList.remove('hidden');

            // 1. Prepare Data
            const sData = getSupplierData(supplierName);
            const supplierParts = [];
            let stats = { total: 0, won: 0, lost: 0, main: 0, totalValue: 0, wonValue: 0 };

            currentProject.items.forEach((item, idx) => {
                let s = null;
                if (item.suppliers && Array.isArray(item.suppliers)) {
                    s = item.suppliers.find(sup => sup.name === supplierName);
                } else if (item.supplier === supplierName) {
                    s = {
                        name: item.supplier,
                        price: item.price_1,
                        currency: item.currency,
                        isMain: item.supplier_is_main !== undefined ? item.supplier_is_main : true,
                        feedback: item.supplier_feedback || 'pending'
                    };
                }

                if (s) {
                    supplierParts.push({ item: item, index: idx, data: s });
                    stats.total++;
                    const price = parseFloat(s.price || 0);
                    stats.totalValue += price;

                    if (s.isMain) stats.main++;
                    if (s.feedback === 'won') {
                        stats.won++;
                        stats.wonValue += price;
                    }
                    if (s.feedback === 'lost') stats.lost++;
                }
            });

            // 2. Render Layout
            content.innerHTML = `
                <div style="display: flex; flex-direction: column; height: 100%;">
                    <!-- Header -->
                    <div style="padding: 20px 24px; background: white; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <h2 style="margin: 0; font-size: 24px; color: #333;">${supplierName}</h2>
                                <span id="sup-status-badge" style="padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; cursor: pointer; background: ${sData.status === 'Active' ? '#e6ffeb' : '#f5f5f7'}; color: ${sData.status === 'Active' ? '#34C759' : '#666'};">
                                    ${sData.status} ▾
                                </span>
                            </div>
                            <div style="margin-top: 8px; display: flex; align-items: center; gap: 16px; font-size: 13px; color: #666;">
                                <span style="cursor: pointer;" onclick="updateSupplierRating('${supplierName}', 1)">${sData.rating >= 1 ? '★' : '☆'}</span>
                                <span style="cursor: pointer;" onclick="updateSupplierRating('${supplierName}', 2)">${sData.rating >= 2 ? '★' : '☆'}</span>
                                <span style="cursor: pointer;" onclick="updateSupplierRating('${supplierName}', 3)">${sData.rating >= 3 ? '★' : '☆'}</span>
                                <span style="cursor: pointer;" onclick="updateSupplierRating('${supplierName}', 4)">${sData.rating >= 4 ? '★' : '☆'}</span>
                                <span style="cursor: pointer;" onclick="updateSupplierRating('${supplierName}', 5)">${sData.rating >= 5 ? '★' : '☆'}</span>
                                <span style="margin-left: 8px;">${supplierParts.length} Items Linked</span>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 12px; color: #999; margin-bottom: 4px;">Total Potential Value</div>
                            <div style="font-size: 20px; font-weight: 600; color: #333;">€${stats.totalValue.toFixed(2)}</div>
                        </div>
                    </div>

                    <!-- Tabs -->
                    <div style="padding: 0 24px; background: white; border-bottom: 1px solid #eee; display: flex; gap: 24px;">
                        <div class="tab-item active" data-tab="overview" style="padding: 12px 0; font-size: 13px; font-weight: 500; color: #007AFF; border-bottom: 2px solid #007AFF; cursor: pointer;">Overview</div>
                        <div class="tab-item" data-tab="parts" style="padding: 12px 0; font-size: 13px; font-weight: 500; color: #666; cursor: pointer;">Parts (${stats.total})</div>
                        <div class="tab-item" data-tab="contact" style="padding: 12px 0; font-size: 13px; font-weight: 500; color: #666; cursor: pointer;">Contact Info</div>
                        <div class="tab-item" data-tab="notes" style="padding: 12px 0; font-size: 13px; font-weight: 500; color: #666; cursor: pointer;">Notes</div>
                    </div>

                    <!-- Content Area -->
                    <div id="sup-tab-content" style="flex: 1; overflow-y: auto; padding: 24px; background: #f5f5f7;">
                        <!-- Overview Tab -->
                        <div id="tab-overview" class="tab-pane">
                            <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr); padding: 0; margin-bottom: 24px;">
                                <div class="stat-card">
                                    <div class="stat-label">Win Rate</div>
                                    <div class="stat-value">${stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0}%</div>
                                    <div style="height: 4px; background: #eee; margin-top: 8px; border-radius: 2px; overflow: hidden;">
                                        <div style="width: ${stats.total > 0 ? (stats.won / stats.total) * 100 : 0}%; height: 100%; background: #34C759;"></div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-label">Won Value</div>
                                    <div class="stat-value color-green">€${stats.wonValue.toFixed(2)}</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-label">Main Supplier For</div>
                                    <div class="stat-value color-blue">${stats.main} <span style="font-size: 14px; color: #999; font-weight: 400;">items</span></div>
                                </div>
                            </div>

                            <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #eee;">
                                <h3 style="margin-top: 0; font-size: 15px;">Quick Actions</h3>
                                <div style="display: flex; gap: 10px; margin-top: 15px;">
                                     <button class="btn-secondary" onclick="window.bulkUpdateSupplier('${supplierName}', 'main', true)">Set All Main</button>
                                     <button class="btn-secondary" onclick="window.bulkUpdateSupplier('${supplierName}', 'feedback', 'won')">Mark All Won</button>
                                     <button class="btn-secondary" onclick="window.bulkUpdateSupplier('${supplierName}', 'feedback', 'lost')">Mark All Lost</button>
                                </div>
                            </div>
                        </div>

                        <!-- Parts Tab -->
                        <div id="tab-parts" class="tab-pane hidden">
                            <div style="background: white; border-radius: 12px; border: 1px solid #eee; overflow: hidden;">
                                <table class="rfq-table">
                                    <thead>
                                        <tr>
                                            <th>Item No.</th>
                                            <th>Description</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${supplierParts.map(p => `
                                            <tr>
                                                <td><b>${p.item.item_drawing_no}</b></td>
                                                <td>${p.item.description}</td>
                                                <td>${p.data.currency} ${parseFloat(p.data.price || 0).toFixed(2)}</td>
                                                <td>
                                                    <span style="
                                                        padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 500;
                                                        background: ${p.data.feedback === 'won' ? '#e6ffeb' : p.data.feedback === 'lost' ? '#ffe6e6' : '#f5f5f7'};
                                                        color: ${p.data.feedback === 'won' ? '#34C759' : p.data.feedback === 'lost' ? '#FF3B30' : '#666'};
                                                    ">
                                                        ${p.data.feedback ? p.data.feedback.toUpperCase() : 'PENDING'}
                                                    </span>
                                                    ${p.data.isMain ? '<span style="margin-left:6px;">⭐</span>' : ''}
                                                </td>
                                                <td>
                                                    <button class="btn-text" onclick="window.openItemInProject('${currentProject.id}', '${p.item.item_drawing_no}')">View Item</button>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Contact Tab -->
                        <div id="tab-contact" class="tab-pane hidden">
                            <div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #eee; max-width: 600px;">
                                <div class="form-row">
                                    <label>Contact Name</label>
                                    <input class="macos-input" id="sup-contact-name" value="${sData.contact.name || ''}" placeholder="e.g. John Doe">
                                </div>
                                <div class="form-row">
                                    <label>Email</label>
                                    <input class="macos-input" id="sup-contact-email" value="${sData.contact.email || ''}" placeholder="john@example.com">
                                </div>
                                <div class="form-row">
                                    <label>Phone</label>
                                    <input class="macos-input" id="sup-contact-phone" value="${sData.contact.phone || ''}" placeholder="+1 234 567 890">
                                </div>
                                <div class="form-row">
                                    <label>Address</label>
                                    <textarea class="macos-input" id="sup-contact-address" rows="3">${sData.contact.address || ''}</textarea>
                                </div>
                                <div class="form-row">
                                    <label>Website</label>
                                    <input class="macos-input" id="sup-contact-website" value="${sData.contact.website || ''}" placeholder="https://...">
                                </div>
                                <div style="margin-top: 20px; text-align: right;">
                                    <button class="btn-primary" onclick="saveSupplierContact('${supplierName}')">Uložit Contact Info</button>
                                </div>
                            </div>
                        </div>

                        <!-- Notes Tab -->
                        <div id="tab-notes" class="tab-pane hidden">
                             <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                                 <textarea id="sup-new-note" class="macos-input" rows="2" placeholder="Add a note..." style="flex: 1;"></textarea>
                                 <button class="btn-primary" onclick="addSupplierNote('${supplierName}')" style="height: fit-content;">Add Note</button>
                             </div>
                             <div id="sup-notes-list">
                                 ${(sData.notes || []).slice().reverse().map(note => `
                                     <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #eee; margin-bottom: 12px;">
                                         <div style="font-size: 11px; color: #999; margin-bottom: 6px;">${new Date(note.date).toLocaleString()}</div>
                                         <div style="font-size: 13px; color: #333; white-space: pre-wrap;">${note.text}</div>
                                     </div>
                                 `).join('')}
                                 ${(!sData.notes || sData.notes.length === 0) ? '<div style="color:#999; text-align:center; padding:20px;">No notes yet</div>' : ''}
                             </div>
                        </div>
                    </div>
                    <div id="sourcing-targets-list" style="margin-top:10px;"></div>
                </div>
             `;

            // 3. Setup Event Listeners
            btnClose.onclick = () => supplierDetailWindow.classList.add('hidden');

            // Footer buttons
            const btnCloseFooter = getEl('btn-close-supplier-footer');
            const btnExportSupplier = getEl('btn-export-supplier');

            if (btnCloseFooter) {
                btnCloseFooter.onclick = () => supplierDetailWindow.classList.add('hidden');
            }

            if (btnExportSupplier) {
                btnExportSupplier.onclick = () => {
                    alert('Export Supplier Data feature - Coming soon!');
                };
            }

            // Tab Switching Logic
            const tabs = content.querySelectorAll('.tab-item');
            const panes = content.querySelectorAll('.tab-pane');

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Update Tabs
                    tabs.forEach(t => {
                        t.classList.remove('active');
                        t.style.color = '#666';
                        t.style.borderBottom = 'none';
                    });
                    tab.classList.add('active');
                    tab.style.color = '#007AFF';
                    tab.style.borderBottom = '2px solid #007AFF';

                    // Update Panes
                    const target = tab.dataset.tab;
                    panes.forEach(p => p.classList.add('hidden'));
                    content.querySelector(`#tab-${target}`).classList.remove('hidden');
                });
            });

            // Status Badge Logic
            const badge = content.querySelector('#sup-status-badge');
            badge.onclick = () => {
                const newStatus = sData.status === 'Active' ? 'On Hold' : sData.status === 'On Hold' ? 'Inactive' : 'Active';
                sData.status = newStatus;
                saveSupplierData(supplierName, sData);
                window.openSupplierDetail(supplierName); // Re-render
            };
        };

        // --- SUPPLIER ACTIONS ---

        window.updateSupplierRating = (name, rating) => {
            const data = getSupplierData(name);
            data.rating = rating;
            saveSupplierData(name, data);
            window.openSupplierDetail(name);
        };

        window.saveSupplierContact = (name) => {
            const data = getSupplierData(name);
            data.contact = {
                name: document.getElementById('sup-contact-name').value,
                email: document.getElementById('sup-contact-email').value,
                phone: document.getElementById('sup-contact-phone').value,
                address: document.getElementById('sup-contact-address').value,
                website: document.getElementById('sup-contact-website').value
            };
            saveSupplierData(name, data);
            alert('Contact information saved!');
        };

        window.addSupplierNote = (name) => {
            const txt = document.getElementById('sup-new-note');
            if (!txt.value.trim()) return;

            const data = getSupplierData(name);
            if (!data.notes) data.notes = [];
            data.notes.push({
                text: txt.value.trim(),
                date: new Date().toISOString()
            });
            saveSupplierData(name, data);
            window.openSupplierDetail(name);
        };


        function openPriceList() {
            if (!currentProject || !currentProject.items) return;

            const sheet = document.getElementById('sheet-price-list');
            const body = document.getElementById('price-list-body');
            if (sheet) sheet.classList.remove('hidden');

            const date = new Date().toLocaleDateString();
            const _num = (v) => { const s = String(v ?? '').replace(',', '.').trim(); const n = parseFloat(s); return isFinite(n) ? n : 0; };
            const _getMainSupplier = (item) => {
                try {
                    if (Array.isArray(item.suppliers) && item.suppliers.length) {
                        return item.suppliers.find(s => s && (s.isMain || s.is_main)) || item.suppliers[0];
                    }
                } catch (e) {}
                return null;
            };
            const _getMainSupName = (item, sup) => {
                const s = sup || _getMainSupplier(item);
                return (s && (s.name || s.supplier_name || s.supplier)) ? (s.name || s.supplier_name || s.supplier) : (item.supplier || '');
            };
            const _getCur = (item, sup) => {
                const s = sup || _getMainSupplier(item);
                return (s && (s.currency || s.cur)) ? (s.currency || s.cur) : (item.currency || 'EUR');
            };
            const _rateToEur = (cur) => {
                try {
                    const c = String(cur || 'EUR').toUpperCase();
                    return (window.CURRENCY_RATES && window.CURRENCY_RATES[c]) ? window.CURRENCY_RATES[c] : 1;
                } catch (e) { return 1; }
            };
            const _getUnitOrig = (item, sup) => {
                const s = sup || _getMainSupplier(item);
                let v = '';
                try {
                    v = s ? getSupplierPriceByIndex(s, 1) : '';
                } catch (e) {}
                if (!v) v = item.price_1 || item.price || '';
                return _num(v);
            };
            const _getUnitEur = (item, sup) => {
                const cur = _getCur(item, sup);
                const unitOrig = _getUnitOrig(item, sup);
                return unitOrig * _rateToEur(cur);
            };
            const _getQty = (item) => {
                const q = _num(item.qty_1);
                return q || 0;
            };

            const totalValue = currentProject.items.reduce((sum, item) => {
                const sup = _getMainSupplier(item);
                const unitEur = _getUnitEur(item, sup);
                const qty = _getQty(item);
                return sum + (unitEur * qty);
            }, 0);

            let html = `
                <div style="font-family: 'Times New Roman', serif; color: black;">
                    <div style="border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
                        <div>
                            <h1 style="margin: 0; font-size: 24px;">Price List / Cenová Nabídka</h1>
                            <div style="font-size: 14px; margin-top: 5px;">Project: <b>${currentProject.name}</b></div>
                        </div>
                        <div style="text-align: right; font-size: 12px;">
                            <div>Date: ${date}</div>
                            <div>Total Value: <b>€${totalValue.toFixed(4)}</b></div>
                        </div>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                        <thead>
                            <tr style="border-bottom: 1px solid black;">
                                <th style="text-align: left; padding: 5px;">Item / Drawing</th>
                                <th style="text-align: left; padding: 5px;">Description</th>
                                <th style="text-align: center; padding: 5px;">Qty</th>
                                <th style="text-align: left; padding: 5px;">Supplier</th>
                                <th style="text-align: right; padding: 5px;">Unit (EUR)</th>
                                <th style="text-align: right; padding: 5px;">Total (EUR)</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            const sortedItems = [...currentProject.items].sort((a, b) => {
                const sa = _getMainSupName(a);
                const sb = _getMainSupName(b);
                return String(sa || '').localeCompare(String(sb || ''));
            });

            sortedItems.forEach(item => {
                const sup = _getMainSupplier(item);
                const supName = _getMainSupName(item, sup) || '-';
                const cur = _getCur(item, sup) || 'EUR';
                const unitEur = _getUnitEur(item, sup);
                const qty = _getQty(item);
                const unitOrig = _getUnitOrig(item, sup);

                html += `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 5px;"><b>${item.item_drawing_no || '-'}</b></td>
                        <td style="padding: 5px;">${item.description || '-'}</td>
                        <td style="text-align: center; padding: 5px;">${item.qty_1 || '-'}</td>
                        <td style="padding: 5px;">${escapeHtml(String(supName))}</td>
                        <td style="text-align: right; padding: 5px;">€${unitEur.toFixed(4)} <span style="color:#666;font-size:10px;">(${unitOrig.toFixed(4)} ${escapeHtml(String(cur))})</span></td>
                        <td style="text-align: right; padding: 5px;">€${(unitEur * qty).toFixed(4)}</td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                        <tfoot>
                            <tr style="border-top: 2px solid black;">
                                <td colspan="5" style="text-align: right; padding: 10px; font-weight: bold;">Grand Total:</td>
                                <td style="text-align: right; padding: 10px; font-weight: bold;">€${totalValue.toFixed(4)}</td>
                            </tr>
                        </tfoot>
                    </table>
                    
                    <div style="margin-top: 40px; display: flex; justify-content: space-between;">
                        <div style="width: 200px; border-top: 1px solid black; padding-top: 5px; text-align: center; font-size: 12px;">
                            Approved By
                        </div>
                        <div style="width: 200px; border-top: 1px solid black; padding-top: 5px; text-align: center; font-size: 12px;">
                            Date & Signature
                        </div>
                    </div>
                </div>`;

            if (body) body.innerHTML = html;
        }

        // --- Uložit Detail Logic (Custom Implementation) ---

        // --- Uložit Detail Logic (Unified, keeps legacy buttons too) ---
        function handleUložitDetail(shouldClose) {
    try {
        // Uložit without closing first, so we can guarantee navigation on "Uložit & Back"
        saveDetailChanges(false);

        // visual feedback for 'Uložit' (no close)
        if (!shouldClose) {
            const btn = getEl('btn-save-detail-no-close') || getEl('btn-item-detail-save');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = 'Uložitd!';
                btn.style.background = '#34c759';
                btn.style.color = 'white';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.color = '';
                }, 900);
            }
        }
    } catch (e) {
        console.error('Uložit detail failed', e);
        alert('Uložit failed: ' + (e && e.message ? e.message : String(e)));
    } finally {
        if (shouldClose) {
            try { closeDetailWindow(); } catch (e) {}
        }
    }
}

initApp();


        // Override listeners for Detail Window save buttons
        const btnUložitDetailNoClose = getEl('btn-save-detail-no-close');
        const btnUložitDetail = getEl('btn-save-detail');

        if (btnUložitDetailNoClose) btnUložitDetailNoClose.onclick = () => handleUložitDetail(false);
        if (btnUložitDetail) btnUložitDetail.onclick = () => handleUložitDetail(true);

        // Item Detail (Page View) toolbar
        if (btnItemDetailBack) btnItemDetailBack.onclick = () => closeDetailWindow();
        if (btnItemDetailUložit) btnItemDetailUložit.onclick = () => handleUložitDetail(false);
        if (btnItemDetailUložitBack) btnItemDetailUložitBack.onclick = () => handleUložitDetail(true);
        if (btnItemDetailDelete) btnItemDetailDelete.onclick = () => deleteCurrentItem();

        // --- Post-Init Listeners for Price List ---
        // (Adding here to ensure elements exist after render)
        setTimeout(() => {
            const btnPriceList = getEl('btn-price-list');
            if (btnPriceList) {
                btnPriceList.removeEventListener('click', openPriceList); // Prevent duplicates
                btnPriceList.addEventListener('click', openPriceList);
            }

            const sheetPriceList = getEl('sheet-price-list');
            const btnCloseList = getEl('btn-close-list');
            const btnPrintList = getEl('btn-print-list');

            if (sheetPriceList && btnCloseList) {
                btnCloseList.onclick = () => sheetPriceList.classList.add('hidden');
            }
            if (btnPrintList) {
                btnPrintList.onclick = () => window.print();
            }
        }, 500);

        // --- Missing Functions Implementation ---

        function getSupplierDetails(name) {
            try {
                const store = localStorage.getItem('rfq_supplier_details');
                const data = store ? JSON.parse(store) : {};
                return data[name] || {
                    contact_person: '',
                    email: '',
                    phone: '',
                    address: '',
                    website: '',
                    payment_terms: '',
                    tax_id: ''
                };
            } catch (e) {
                console.error('Error loading supplier details', e);
                return {};
            }
        }

        function saveSupplierDetails(name, details) {
            try {
                const store = localStorage.getItem('rfq_supplier_details');
                const data = store ? JSON.parse(store) : {};
                data[name] = details;
                localStorage.setItem('rfq_supplier_details', JSON.stringify(data));
                return true;
            } catch (e) {
                console.error('Error saving supplier details', e);
                return false;
            }
        }

        window.toggleSupplierEdit = function (name, save = false) {
            const content = getEl('supplier-detail-content');
            if (!content) return;

            if (save) {
                // Uložit mode
                const inputs = content.querySelectorAll('.supplier-edit-input');
                const details = getSupplierDetails(name);

                inputs.forEach(inp => {
                    const field = inp.dataset.field;
                    if (field) details[field] = inp.value;
                });

                saveSupplierDetails(name, details);
                renderSupplierDetail(name); // Re-render to show read-only view
            } else {
                // Enter Edit Mode
                const displays = content.querySelectorAll('.supplier-val-display');
                displays.forEach(el => {
                    const field = el.dataset.field;
                    const val = el.textContent.trim() === '-' ? '' : el.textContent.trim();
                    if (field) {
                        el.innerHTML = `<input type="text" class="supplier-edit-input macos-input" data-field="${field}" value="${val}" style="width: 100%;">`;
                    }
                });

                const btn = getEl('btn-edit-supplier');
                if (btn) {
                    btn.textContent = 'Uložit Changes';
                    btn.classList.remove('btn-secondary');
                    btn.classList.add('btn-primary');
                    btn.onclick = () => window.toggleSupplierEdit(name, true);
                }
            }
        };

        function renderSupplierDetail(supplierName) {
            const view = getEl('view-supplier-detail');
            const content = getEl('supplier-detail-page-content');
            const titleEl = getEl('supplier-detail-page-title');
            if (!view || !content) return;
            const supName = String(supplierName || '').trim();
            if (!supName) return;

            // Ensure view is visible
            view.classList.remove('hidden');

            // Make sure project structures exist
            if (currentProject) ensureProjectSuppliers(currentProject);

            // Master record (project-scoped) + legacy contact details (global)
            const master = currentProject ? getOrCreateSupplierMaster(currentProject, supName) : null;
            const details = (typeof getSupplierDetails === 'function') ? getSupplierDetails(supName) : {};

            // --------- Aggregate across ALL projects (for overview KPIs) ----------
            let totalItems = 0;
            let totalValue = 0;
            let projectsList = new Set();
            let suppliedItems = [];
            let bundlesAll = [];
            let quotesReceived = 0;
            let openBundles = 0;
            let mainSupplierCount = 0;

            const norm = (v) => String(v ?? '').trim().toLowerCase();
            const targetKey = (typeof normalizeSupplierKey === 'function') ? normalizeSupplierKey(supName) : norm(supName);
            const matchSupplier = (name) => {
                const nk = (typeof normalizeSupplierKey === 'function') ? normalizeSupplierKey(name) : norm(name);
                if (!nk || !targetKey) return false;
                if (nk === targetKey) return true;
                if (nk.includes(targetKey) || targetKey.includes(nk)) return true;
                const a = nk.split(' ').filter(Boolean);
                const b = targetKey.split(' ').filter(Boolean);
                const setB = new Set(b);
                let inter = 0;
                a.forEach(t => { if (setB.has(t)) inter++; });
                return inter >= Math.min(2, Math.min(a.length, b.length));
            };

            const getSupplierEntry = (it) => {
                if (Array.isArray(it.suppliers)) {
                    return it.suppliers.find(s => s && matchSupplier(s.name)) || null;
                }
                return null;
            };

            const itemHasSupplier = (it) => {
                if (!it || typeof it !== 'object') return false;
                if (matchSupplier(it.supplier)) return true;
                return !!getSupplierEntry(it);
            };

            if (Array.isArray(projects)) {
                projects.forEach(p => {
                    const pItems = Array.isArray(p.items) ? p.items : [];
                    pItems.forEach(it => {
                        if (!itemHasSupplier(it)) return;
                        totalItems++;
                        projectsList.add(p.name);

                        const supEntry = getSupplierEntry(it);
                        suppliedItems.push({ project: p, item: it, supEntry });

                        // Check if main supplier
                        if (matchSupplier(it.supplier) || (supEntry && supEntry.isMain)) {
                            mainSupplierCount++;
                        }

                        // Calculate value from supplier entry or item
                        let price = 0;
                        let qty = parseFloat(it.qty_1 ?? it.qty ?? 0) || 0;
                        if (supEntry && Array.isArray(supEntry.prices) && supEntry.prices[0]) {
                            price = parseFloat(supEntry.prices[0].price) || 0;
                        } else {
                            price = parseFloat(it.price_1_euro ?? it.price_euro ?? it.price_1 ?? it.price ?? 0) || 0;
                        }
                        totalValue += price * qty;
                    });

                    // RFQ batches for this project
                    if (window.RFQData && typeof window.RFQData.getRFQBatches === 'function' && p.id) {
                        const bs = window.RFQData.getRFQBatches(p.id) || [];
                        bs.forEach(b => {
                            if (!b) return;
                            const bSup = b.supplier_name || b.supplier || b.supplierName || '';
                            if (!matchSupplier(bSup)) return;
                            bundlesAll.push({ project: p, batch: b });
                        });
                    }
                });
            }

            bundlesAll.forEach(({ batch }) => {
                const st = String(batch.status || '').trim();
                const stL = String(st || '').toLowerCase();
                if (stL && !['closed','cancelled','canceled','completed','done'].includes(stL)) openBundles++;
                const lines = Array.isArray(batch.items) ? batch.items : [];
                const anyQuoted = lines.some(x => String(x.quote_status || '').toLowerCase() === 'quoted' || String(x.quote_status || '').toLowerCase() === 'quote received');
                if (anyQuoted) quotesReceived++;
            });

            // --------- Project-scoped bundles (for actions) ----------
            const projectBundles = (currentProject && window.RFQData && typeof window.RFQData.getRFQBatches === 'function')
                ? (window.RFQData.getRFQBatches(currentProject.id) || []).filter(b => matchSupplier(b.supplier_name || b.supplier || b.supplierName || ''))
                : [];

            const pipelineVal = master?.pipeline || 'Prospect';
            const ndaSigned = !!(master && master.nda && master.nda.signed);
            const ndaStatus = master?.nda?.status || (ndaSigned ? 'Signed' : 'Missing');
            const ndaDate = master?.nda?.signed_date || '';
            const ndaStorage = master?.nda?.storage || '';

            const ratingVal = typeof master?.rating === 'number' ? master.rating : (parseFloat(master?.rating) || 0);
            const tagsArr = Array.isArray(master?.tags) ? master.tags : (master?.tags ? String(master.tags).split(',').map(t=>t.trim()).filter(Boolean) : []);
            const tagsVal = tagsArr.join(', ');

            const defCurrency = master?.defaults?.currency || details?.currency_default || 'EUR';
            const defIncoterms = master?.defaults?.incoterms || details?.incoterms_default || 'EXW';
            const defPayTerms = master?.defaults?.payment_terms || details?.payment_terms || '';
            const defLeadTime = master?.defaults?.lead_time || '';
            const defShip = master?.defaults?.shipping_cost || '';
            const defMOQ = master?.defaults?.moq || '';
            const defMOV = master?.defaults?.mov || '';

            const formatMoney = (n) => {
                const v = Number(n || 0);
                return isFinite(v) ? v.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00';
            };

            const badge = (txt, bg, color) => `<span style="padding:4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; background:${bg}; color:${color};">${txt}</span>`;

            const pipelineBadge = (() => {
                const p = String(pipelineVal || '').toLowerCase();
                if (p.includes('blocked')) return badge('BLOCKED', '#ffe5e5', '#c00');
                if (p.includes('approved')) return badge('APPROVED', '#d4edda', '#155724');
                if (p.includes('qualified')) return badge('QUALIFIED', '#cce5ff', '#004085');
                if (p.includes('nda')) return badge('NDA', '#fff3cd', '#856404');
                return badge('PROSPECT', '#e9ecef', '#495057');
            })();

            const ndaBadge = (() => {
                const n = String(ndaStatus || '').toLowerCase();
                if (n.includes('signed')) return badge('NDA SIGNED', '#d4edda', '#155724');
                if (n.includes('sent')) return badge('NDA SENT', '#cce5ff', '#004085');
                if (n.includes('expired')) return badge('NDA EXPIRED', '#f8d7da', '#721c24');
                return badge('NDA MISSING', '#fff3cd', '#856404');
            })();

            // Star rating display
            const renderStars = (rating) => {
                const full = Math.floor(rating);
                const half = rating % 1 >= 0.5 ? 1 : 0;
                const empty = 5 - full - half;
                return '<span style="color:#ffc107; font-size:16px;">' +
                    '★'.repeat(full) +
                    (half ? '☆' : '') +
                    '<span style="color:#ddd;">★</span>'.repeat(empty) +
                    '</span>';
            };

            // Build items table with more supplier data
            const itemsRows = suppliedItems.slice(0, 200).map(({ project, item, supEntry }) => {
                const dn = item.item_drawing_no || '';
                const desc = item.description || '';
                const isMain = matchSupplier(item.supplier) || (supEntry && supEntry.isMain);

                // Get prices from supplier entry
                let prices = [];
                let currency = defCurrency;
                let moq = '', leadTime = '';

                if (supEntry) {
                    prices = Array.isArray(supEntry.prices) ? supEntry.prices : [];
                    currency = supEntry.currency || defCurrency;
                    moq = supEntry.moq || '';
                    leadTime = supEntry.lead_time || '';
                } else {
                    // Fallback to item prices
                    for (let i = 1; i <= 5; i++) {
                        const q = parseFloat(item['qty_' + i]) || 0;
                        const p = parseFloat(item['price_' + i]) || 0;
                        if (q > 0 && p > 0) prices.push({ qty: q, price: p });
                    }
                    currency = item.currency || 'EUR';
                    moq = item.moq || '';
                    leadTime = item.lead_time || '';
                }

                const priceStr = prices.slice(0, 3).map(p => `${p.qty}@${currency}${(parseFloat(p.price) || 0).toFixed(2)}`).join(', ') || '-';

                return `
                    <tr class="${isMain ? 'main-supplier-row' : ''}">
                        <td style="font-weight:600; color:#007AFF; cursor:pointer;" class="sd-open-item" data-proj="${project.id}" data-dn="${escapeAttr(dn)}">${escapeHtml(dn)}</td>
                        <td style="max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escapeAttr(desc)}">${escapeHtml(desc || '-')}</td>
                        <td style="white-space:nowrap;">${priceStr}</td>
                        <td>${escapeHtml(moq || '-')}</td>
                        <td>${escapeHtml(leadTime || '-')}</td>
                        <td>${isMain ? '<span style="color:#28a745; font-weight:700;">Main</span>' : '<span style="color:#999;">Alt</span>'}</td>
                        <td style="color:#666; font-size:11px;">${escapeHtml(project.name || '')}</td>
                    </tr>
                `;
            }).join('') || `<tr><td colspan="7" style="padding:20px; color:#999; text-align:center;">No items linked to this supplier yet.</td></tr>`;

            // Build bundles table
            const bundlesRows = bundlesAll.length ? bundlesAll.map(({ project, batch: b }) => {
                const lines = Array.isArray(b.items) ? b.items : [];
                const total = lines.length || 0;
                const quoted = lines.filter(x => ['quoted','quote received'].includes(String(x.quote_status || '').toLowerCase())).length;
                const nobid = lines.filter(x => String(x.quote_status || '').toLowerCase() === 'no bid').length;
                const pending = Math.max(0, total - quoted - nobid);
                const cov = total ? Math.round((quoted / total) * 100) : 0;
                const due = b.due_date || '';
                const st = String(b.status || 'Open').trim();
                const stClass = st.toLowerCase().includes('closed') ? 'status-closed' : (st.toLowerCase().includes('sent') ? 'status-sent' : 'status-open');
                const created = b.created_at ? new Date(b.created_at).toLocaleDateString() : '';

                return `
                    <tr>
                        <td style="font-weight:600;">${String(b.id || '').slice(0,10)}</td>
                        <td><span class="bundle-status ${stClass}">${escapeHtml(st)}</span></td>
                        <td>${created}</td>
                        <td>${due || '-'}</td>
                        <td>${total}</td>
                        <td>
                            <div style="display:flex; gap:6px; align-items:center;">
                                <div style="flex:1; background:#e9ecef; border-radius:4px; height:8px; overflow:hidden;">
                                    <div style="width:${cov}%; background:#28a745; height:100%;"></div>
                                </div>
                                <span style="font-size:11px; color:#666;">${cov}%</span>
                            </div>
                        </td>
                        <td style="font-size:11px; color:#666;">${escapeHtml(project.name || '')}</td>
                        <td><button class="btn-secondary btn-sm btn-open-bundle" data-bid="${b.id}">Open</button></td>
                    </tr>
                `;
            }).join('') : `<tr><td colspan="8" style="padding:20px; color:#999; text-align:center;">No RFQ Bundles for this supplier.</td></tr>`;

            // Custom fields
            const customArr = (master && Array.isArray(master.custom)) ? master.custom : [];
            const customRows = customArr.map((c, idx) => `
                <tr>
                    <td><input class="macos-input sd-custom-key" data-idx="${idx}" value="${escapeAttr(c.key || '')}" placeholder="Field name"/></td>
                    <td><input class="macos-input sd-custom-val" data-idx="${idx}" value="${escapeAttr(c.value || '')}" placeholder="Value"/></td>
                    <td><button class="btn-danger btn-sm sd-custom-del" data-idx="${idx}">×</button></td>
                </tr>
            `).join('');

            // Notes
            const notesArr = (master && Array.isArray(master.notes_list)) ? master.notes_list
                           : (master && Array.isArray(master.notes)) ? master.notes : [];
            const notesRows = notesArr.slice().reverse().map((n, idx) => `
                <div class="sd-note">
                    <div class="sd-note-meta">${escapeHtml(n.at || new Date().toLocaleString())}</div>
                    <div class="sd-note-text">${escapeHtml(n.text || '')}</div>
                </div>
            `).join('') || `<div style="padding:16px; color:#999; text-align:center;">No notes yet.</div>`;

            // ===== TWO COLUMN LAYOUT (like Item Detail) =====
            content.innerHTML = `
                <div style="display:grid; grid-template-columns: 300px 1fr; gap:24px; height:100%; overflow:hidden;">
                    <!-- LEFT COLUMN -->
                    <div style="display:flex; flex-direction:column; gap:16px; overflow-y:auto; padding-right:8px;">
                        <!-- Supplier Card -->
                        <div class="sd-card" style="text-align:center; padding:20px;">
                            <div style="width:80px; height:80px; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius:50%; margin:0 auto 12px; display:flex; align-items:center; justify-content:center; font-size:32px; color:white; font-weight:700;">
                                ${supName.charAt(0).toUpperCase()}
                            </div>
                            <div style="font-size:18px; font-weight:800; margin-bottom:8px;">${escapeHtml(supName)}</div>
                            <div style="display:flex; gap:6px; justify-content:center; flex-wrap:wrap; margin-bottom:12px;">
                                ${pipelineBadge}
                                ${ndaBadge}
                            </div>
                            <div style="margin-bottom:8px;">
                                ${renderStars(ratingVal)}
                                <span style="font-size:12px; color:#666; margin-left:4px;">(${ratingVal.toFixed(1)})</span>
                            </div>
                            ${tagsArr.length ? `<div style="display:flex; gap:4px; flex-wrap:wrap; justify-content:center;">${tagsArr.map(t => `<span style="background:#e9ecef; padding:2px 8px; border-radius:999px; font-size:11px;">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
                        </div>

                        <!-- KPIs -->
                        <div class="sd-card">
                            <div class="sd-card-title">Statistics</div>
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                                <div class="sd-kpi"><div class="sd-kpi-l">Total Items</div><div class="sd-kpi-v">${totalItems}</div></div>
                                <div class="sd-kpi"><div class="sd-kpi-l">Main Supplier</div><div class="sd-kpi-v">${mainSupplierCount}</div></div>
                                <div class="sd-kpi"><div class="sd-kpi-l">Projects</div><div class="sd-kpi-v">${projectsList.size}</div></div>
                                <div class="sd-kpi"><div class="sd-kpi-l">RFQ Bundles</div><div class="sd-kpi-v">${bundlesAll.length}</div></div>
                                <div class="sd-kpi" style="grid-column:1/-1;"><div class="sd-kpi-l">Total Value (approx.)</div><div class="sd-kpi-v" style="color:#28a745;">€ ${formatMoney(totalValue)}</div></div>
                            </div>
                        </div>

                        <!-- Quick Actions -->
                        <div class="sd-card">
                            <div class="sd-card-title">Quick Actions</div>
                            <div style="display:flex; flex-direction:column; gap:8px;">
                                <button class="btn-primary" id="sd-open-quoting" style="width:100%;">Open Quoting</button>
                                <button class="btn-secondary" id="sd-open-bulk" style="width:100%;">Bulk Pricing</button>
                                <button class="btn-secondary" id="sd-new-bundle" style="width:100%;">+ New RFQ Bundle</button>
                                <button class="btn-secondary" id="sd-export" style="width:100%;">Export Data</button>
                            </div>
                        </div>

                        <!-- Contact Summary -->
                        <div class="sd-card">
                            <div class="sd-card-title">Contact</div>
                            <div style="font-size:13px; display:flex; flex-direction:column; gap:6px;">
                                ${details.contact_person ? `<div><strong>Contact:</strong> ${escapeHtml(details.contact_person)}</div>` : ''}
                                ${details.email ? `<div><strong>Email:</strong> <a href="mailto:${escapeAttr(details.email)}" style="color:#007AFF;">${escapeHtml(details.email)}</a></div>` : ''}
                                ${details.phone ? `<div><strong>Phone:</strong> ${escapeHtml(details.phone)}</div>` : ''}
                                ${details.website ? `<div><strong>Web:</strong> <a href="${escapeAttr(details.website)}" target="_blank" style="color:#007AFF;">${escapeHtml(details.website)}</a></div>` : ''}
                                ${!details.contact_person && !details.email && !details.phone ? '<div style="color:#999;">No contact info yet</div>' : ''}
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN with Tabs -->
                    <div style="display:flex; flex-direction:column; overflow:hidden;">
                        <!-- Tab Header -->
                        <div class="sd-tabs" style="flex-shrink:0;">
                            <button class="sd-tab active" data-tab="overview">Overview</button>
                            <button class="sd-tab" data-tab="items">Items & Pricing</button>
                            <button class="sd-tab" data-tab="rfq">RFQ History</button>
                            <button class="sd-tab" data-tab="compliance">NDA & Docs</button>
                            <button class="sd-tab" data-tab="notes">Notes</button>
                        </div>

                        <!-- Tab Panels -->
                        <div class="sd-panels" style="flex:1; overflow-y:auto;">
                            <!-- OVERVIEW TAB -->
                            <div class="sd-panel active" data-panel="overview">
                                <div class="sd-grid2">
                                    <div class="sd-card">
                                        <div class="sd-card-title">Master Status</div>
                                        <div class="detail-grid" style="grid-template-columns: 1fr 1fr; gap: 12px;">
                                            <div class="form-row">
                                                <label>Pipeline Stage</label>
                                                <select class="macos-input" data-sm-field="pipeline">
                                                    ${['Prospect','NDA','Qualified','Approved','Blocked'].map(x=>`<option ${x===pipelineVal?'selected':''}>${x}</option>`).join('')}
                                                </select>
                                            </div>
                                            <div class="form-row">
                                                <label>Rating (0-5)</label>
                                                <input class="macos-input" type="number" min="0" max="5" step="0.5" data-sm-field="rating" value="${ratingVal||''}" placeholder="0-5"/>
                                            </div>
                                            <div class="form-row" style="grid-column: 1 / -1;">
                                                <label>Tags (comma-separated)</label>
                                                <input class="macos-input" data-sm-field="tags" value="${escapeAttr(tagsVal)}" placeholder="PCB, Assembly, EU, Fast delivery..."/>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="sd-card">
                                        <div class="sd-card-title">Contact Details</div>
                                        <div class="detail-grid" style="grid-template-columns: 1fr 1fr; gap: 12px;">
                                            <div class="form-row">
                                                <label>Contact Person</label>
                                                <input class="macos-input" data-sd-field="contact_person" value="${escapeAttr(details.contact_person||'')}" placeholder="Name"/>
                                            </div>
                                            <div class="form-row">
                                                <label>Email</label>
                                                <input class="macos-input" type="email" data-sd-field="email" value="${escapeAttr(details.email||'')}" placeholder="email@company.com"/>
                                            </div>
                                            <div class="form-row">
                                                <label>Phone</label>
                                                <input class="macos-input" data-sd-field="phone" value="${escapeAttr(details.phone||'')}" placeholder="+420..."/>
                                            </div>
                                            <div class="form-row">
                                                <label>Website</label>
                                                <input class="macos-input" data-sd-field="website" value="${escapeAttr(details.website||'')}" placeholder="https://..."/>
                                            </div>
                                            <div class="form-row" style="grid-column: 1 / -1;">
                                                <label>Address</label>
                                                <input class="macos-input" data-sd-field="address" value="${escapeAttr(details.address||'')}" placeholder="Street, City, Country"/>
                                            </div>
                                            <div class="form-row">
                                                <label>Payment Terms</label>
                                                <input class="macos-input" data-sd-field="payment_terms" value="${escapeAttr(details.payment_terms||'')}" placeholder="Net 30"/>
                                            </div>
                                            <div class="form-row">
                                                <label>Tax/VAT ID</label>
                                                <input class="macos-input" data-sd-field="tax_id" value="${escapeAttr(details.tax_id||'')}" placeholder="CZ12345678"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="sd-card" style="margin-top:16px;">
                                    <div class="sd-card-title">Default Terms (for new quotes)</div>
                                    <div class="detail-grid" style="grid-template-columns: repeat(4, 1fr); gap: 12px;">
                                        <div class="form-row">
                                            <label>Currency</label>
                                            <select class="macos-input" data-sm-field="defaults.currency">
                                                ${(window.RFQData?.CURRENCIES || ['EUR','USD','CZK','GBP','CNY']).map(x=>`<option ${x===defCurrency?'selected':''}>${x}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div class="form-row">
                                            <label>Incoterms</label>
                                            <select class="macos-input" data-sm-field="defaults.incoterms">
                                                ${(window.RFQData?.INCOTERMS || ['EXW','FCA','FOB','CIF','DAP','DDP']).map(x=>`<option ${x===defIncoterms?'selected':''}>${x}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div class="form-row">
                                            <label>Lead Time</label>
                                            <input class="macos-input" data-sm-field="defaults.lead_time" value="${escapeAttr(defLeadTime)}" placeholder="4 weeks"/>
                                        </div>
                                        <div class="form-row">
                                            <label>Shipping Cost</label>
                                            <input class="macos-input" data-sm-field="defaults.shipping_cost" value="${escapeAttr(defShip)}" placeholder="25"/>
                                        </div>
                                        <div class="form-row">
                                            <label>MOQ</label>
                                            <input class="macos-input" data-sm-field="defaults.moq" value="${escapeAttr(defMOQ)}" placeholder="Min order qty"/>
                                        </div>
                                        <div class="form-row">
                                            <label>MOV</label>
                                            <input class="macos-input" data-sm-field="defaults.mov" value="${escapeAttr(defMOV)}" placeholder="Min order value"/>
                                        </div>
                                        <div class="form-row" style="grid-column: span 2;">
                                            <label>Payment Terms</label>
                                            <input class="macos-input" data-sm-field="defaults.payment_terms" value="${escapeAttr(defPayTerms)}" placeholder="Net 30, prepaid..."/>
                                        </div>
                                    </div>
                                </div>

                                <!-- Custom Fields inline -->
                                <div class="sd-card" style="margin-top:16px;">
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                                        <div class="sd-card-title" style="margin:0;">Custom Fields</div>
                                        <button class="btn-primary btn-sm" id="sd-custom-add">+ Add</button>
                                    </div>
                                    <table class="items-table" style="font-size:13px;">
                                        <thead><tr><th>Field</th><th>Value</th><th style="width:50px;"></th></tr></thead>
                                        <tbody id="sd-custom-tbody">${customRows || '<tr><td colspan="3" style="padding:12px; color:#999; text-align:center;">No custom fields</td></tr>'}</tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- ITEMS TAB -->
                            <div class="sd-panel" data-panel="items">
                                <div class="sd-card" style="height:100%; display:flex; flex-direction:column;">
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                                        <div class="sd-card-title" style="margin:0;">Items supplied (${totalItems})</div>
                                        <div style="font-size:12px; color:#666;">Main: ${mainSupplierCount} | Alt: ${totalItems - mainSupplierCount}</div>
                                    </div>
                                    <div class="table-wrapper" style="flex:1; overflow:auto;">
                                        <table class="sd-items-table resizable-table draggable-table" id="sd-items-table">
                                            <thead>
                                                <tr>
                                                    <th data-col-id="drawing_no"><span class="col-drag-handle">⋮⋮</span>Drawing No</th>
                                                    <th data-col-id="description"><span class="col-drag-handle">⋮⋮</span>Description</th>
                                                    <th data-col-id="prices"><span class="col-drag-handle">⋮⋮</span>Prices (Qty@Price)</th>
                                                    <th data-col-id="moq"><span class="col-drag-handle">⋮⋮</span>MOQ</th>
                                                    <th data-col-id="lead_time"><span class="col-drag-handle">⋮⋮</span>Lead Time</th>
                                                    <th data-col-id="type"><span class="col-drag-handle">⋮⋮</span>Type</th>
                                                    <th data-col-id="project"><span class="col-drag-handle">⋮⋮</span>Project</th>
                                                </tr>
                                            </thead>
                                            <tbody>${itemsRows}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <!-- RFQ HISTORY TAB -->
                            <div class="sd-panel" data-panel="rfq">
                                <div class="sd-card" style="height:100%; display:flex; flex-direction:column;">
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                                        <div class="sd-card-title" style="margin:0;">RFQ Bundles (${bundlesAll.length})</div>
                                        <div style="display:flex; gap:8px;">
                                            <span style="font-size:12px; color:#28a745;">Quoted: ${quotesReceived}</span>
                                            <span style="font-size:12px; color:#ffc107;">Open: ${openBundles}</span>
                                        </div>
                                    </div>
                                    <div class="table-wrapper" style="flex:1; overflow:auto;">
                                        <table class="sd-items-table resizable-table draggable-table" id="sd-rfq-history-table">
                                            <thead>
                                                <tr>
                                                    <th data-col-id="bundle_id"><span class="col-drag-handle">⋮⋮</span>Bundle ID</th>
                                                    <th data-col-id="status"><span class="col-drag-handle">⋮⋮</span>Status</th>
                                                    <th data-col-id="created"><span class="col-drag-handle">⋮⋮</span>Created</th>
                                                    <th data-col-id="due_date"><span class="col-drag-handle">⋮⋮</span>Due Date</th>
                                                    <th data-col-id="items"><span class="col-drag-handle">⋮⋮</span>Items</th>
                                                    <th data-col-id="coverage" style="width:120px;"><span class="col-drag-handle">⋮⋮</span>Coverage</th>
                                                    <th data-col-id="project"><span class="col-drag-handle">⋮⋮</span>Project</th>
                                                    <th data-col-id="actions"></th>
                                                </tr>
                                            </thead>
                                            <tbody>${bundlesRows}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <!-- COMPLIANCE TAB -->
                            <div class="sd-panel" data-panel="compliance">
                                <div class="sd-grid2">
                                    <div class="sd-card">
                                        <div class="sd-card-title">NDA Status</div>
                                        <div class="detail-grid" style="grid-template-columns: 1fr 1fr; gap: 12px;">
                                            <div class="form-row">
                                                <label>NDA Status</label>
                                                <select class="macos-input" data-sm-field="nda.status">
                                                    ${['Missing','Sent','Signed','Expired'].map(x=>`<option ${x===ndaStatus?'selected':''}>${x}</option>`).join('')}
                                                </select>
                                            </div>
                                            <div class="form-row">
                                                <label>Signed Date</label>
                                                <input class="macos-input" type="date" data-sm-field="nda.signed_date" value="${escapeAttr(ndaDate)}"/>
                                            </div>
                                            <div class="form-row" style="grid-column: 1 / -1;">
                                                <label>Document Link/Path</label>
                                                <input class="macos-input" data-sm-field="nda.storage" value="${escapeAttr(ndaStorage)}" placeholder="URL or file path"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="sd-card">
                                        <div class="sd-card-title">Documents & Links</div>
                                        <div class="detail-grid" style="gap: 12px;">
                                            <div class="form-row">
                                                <label>Supplier Profile</label>
                                                <input class="macos-input" data-sm-field="docs.profile" value="${escapeAttr(master?.docs?.profile || '')}" placeholder="URL"/>
                                            </div>
                                            <div class="form-row">
                                                <label>Certifications (ISO, etc.)</label>
                                                <input class="macos-input" data-sm-field="docs.certifications" value="${escapeAttr(master?.docs?.certifications || '')}" placeholder="ISO9001, IATF16949..."/>
                                            </div>
                                            <div class="form-row">
                                                <label>Other Documents</label>
                                                <input class="macos-input" data-sm-field="docs.other" value="${escapeAttr(master?.docs?.other || '')}" placeholder="Links or notes"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="sd-card" style="margin-top:16px;">
                                    <div class="sd-card-title">Compliance Notes</div>
                                    <textarea class="macos-input" data-sm-field="compliance_notes" rows="5" style="width:100%;" placeholder="RoHS, REACH, audits, quality notes...">${escapeHtml(master?.compliance_notes || '')}</textarea>
                                </div>
                            </div>

                            <!-- NOTES TAB -->
                            <div class="sd-panel" data-panel="notes">
                                <div class="sd-grid2">
                                    <div class="sd-card">
                                        <div class="sd-card-title">Add New Note</div>
                                        <textarea id="sd-note-text" class="macos-input" rows="6" style="width:100%;" placeholder="Write a note about this supplier..."></textarea>
                                        <div style="display:flex; gap:8px; margin-top:12px;">
                                            <button class="btn-primary" id="sd-note-add">Add Note</button>
                                            <button class="btn-secondary" id="sd-note-clear">Clear</button>
                                        </div>
                                    </div>
                                    <div class="sd-card" style="max-height:400px; overflow-y:auto;">
                                        <div class="sd-card-title">Notes History (${notesArr.length})</div>
                                        <div id="sd-notes-list">${notesRows}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Bar -->
                        <div style="display:flex; justify-content:flex-end; gap:10px; padding:12px 0; border-top:1px solid #e5e5ea; flex-shrink:0;">
                            <button class="btn-secondary" id="sd-close">Back</button>
                            <button class="btn-success" id="sd-save">Save</button>
                            <button class="btn-primary" id="sd-save-close">Save & Close</button>
                        </div>
                    </div>
                </div>
            `;

            // --------- Tabs ----------
            const tabs = content.querySelectorAll('.sd-tab');
            const panels = content.querySelectorAll('.sd-panel');
            tabs.forEach(btn => {
                btn.addEventListener('click', () => {
                    tabs.forEach(b=>b.classList.remove('active'));
                    panels.forEach(p=>p.classList.remove('active'));
                    btn.classList.add('active');
                    const t = btn.dataset.tab;
                    const panel = content.querySelector(`.sd-panel[data-panel="${t}"]`);
                    if (panel) panel.classList.add('active');
                });
            });

            // --------- Actions ----------
            const close = () => { try { switchView(supplierDetailReturnView || 'suppliers'); } catch(e) { view.classList.add('hidden'); } };

            const saveAll = () => {
                // Uložit legacy details
                const d = (typeof getSupplierDetails === 'function') ? getSupplierDetails(supName) : {};
                content.querySelectorAll('[data-sd-field]').forEach(inp => {
                    const k = inp.dataset.sdField;
                    d[k] = (inp.value ?? '').toString();
                });
                if (typeof saveSupplierDetails === 'function') saveSupplierDetails(supName, d);

                // Uložit master (project-scoped)
                if (currentProject && master) {
                    const setNested = (obj, path, value) => {
                        const parts = String(path||'').split('.');
                        let cur = obj;
                        for (let i=0;i<parts.length-1;i++){
                            const p = parts[i];
                            if (!cur[p] || typeof cur[p] !== 'object') cur[p] = {};
                            cur = cur[p];
                        }
                        cur[parts[parts.length-1]] = value;
                    };

                    content.querySelectorAll('[data-sm-field]').forEach(inp => {
                        const k = inp.dataset.smField;
                        let v = (inp.value ?? '').toString();
                        if (k === 'rating') v = parseFloat(v || '0') || 0;
                        if (k === 'tags') {
                            const arr = v.split(',').map(x=>x.trim()).filter(Boolean);
                            setNested(master, 'tags', arr);
                            return;
                        }
                        setNested(master, k, v);
                    });

                    // Keep nda.signed boolean consistent with status
                    const st = String(master?.nda?.status || '').toLowerCase();
                    if (!master.nda) master.nda = {};
                    master.nda.signed = st.includes('signed');

                    // Custom fields
                    const newCustom = [];
                    const rows = content.querySelectorAll('#sd-custom-tbody tr');
                    rows.forEach((tr) => {
                        const keyInp = tr.querySelector('.sd-custom-key');
                        const valInp = tr.querySelector('.sd-custom-val');
                        if (!keyInp || !valInp) return;
                        const key = String(keyInp.value||'').trim();
                        const val = String(valInp.value||'').trim();
                        if (!key && !val) return;
                        newCustom.push({ key, value: val });
                    });
                    master.custom = newCustom;

                    // Persist
                    upsertSupplierMaster(currentProject, master);
                    updateProject(currentProject);
                }

                // Re-render supplier list / quoting if needed (best-effort)
                if (typeof renderSupplierList === 'function') {
                    try { renderSupplierList(); } catch (e) {}
                }
                if (typeof renderQuoting === 'function') {
                    try { renderQuoting(); } catch (e) {}
                }
            };

            const saveBtn = content.querySelector('#sd-save');
            const saveCloseBtn = content.querySelector('#sd-save-close');
            const closeBtn = content.querySelector('#sd-close');

            if (saveBtn) saveBtn.addEventListener('click', () => saveAll());
            if (saveCloseBtn) saveCloseBtn.addEventListener('click', () => { saveAll(); close(); });
            if (closeBtn) closeBtn.addEventListener('click', () => close());

            const exportBtn = content.querySelector('#sd-export');
            if (exportBtn) exportBtn.addEventListener('click', () => {
                const footerExport = getEl('btn-export-supplier');
                if (footerExport) footerExport.click();
            });

            const openQuotingBtn = content.querySelector('#sd-open-quoting');
            if (openQuotingBtn) openQuotingBtn.addEventListener('click', () => {
                try { switchView('quoting'); } catch (e) {}
                try {
                    const f = getEl('qt-supplier-filter');
                    if (f) { f.value = supName; f.dispatchEvent(new Event('input')); }
                } catch (e) {}
                try {
                    if (typeof setQuotingSupplier === 'function') {
                        setQuotingSupplier(supName);
                    } else {
                        const st = (typeof getQuotingState === 'function') ? getQuotingState() : null;
                        if (st) { st.supplier = supName; st.batchId = ''; st.mode = 'supplier'; }
                        if (typeof renderQuotingView === 'function') renderQuotingView();
                    }
                } catch (e) {}
            });

            const openBulkBtn = content.querySelector('#sd-open-bulk');
            if (openBulkBtn) openBulkBtn.addEventListener('click', () => {
                try { switchView('suppliers'); } catch (e) {}
                const sel = getEl('bulk-supplier-select');
                if (sel) {
                    sel.value = supName;
                    sel.dispatchEvent(new Event('change'));
                }
            });

            const newBundleBtn = content.querySelector('#sd-new-bundle');
            if (newBundleBtn) newBundleBtn.addEventListener('click', () => {
                try { switchView('quoting'); } catch (e) {}
                try {
                    const f = getEl('qt-supplier-filter');
                    if (f) { f.value = supName; f.dispatchEvent(new Event('input')); }
                } catch (e) {}
                try {
                    if (typeof setQuotingSupplier === 'function') setQuotingSupplier(supName);
                    const st = (typeof getQuotingState === 'function') ? getQuotingState() : null;
                    if (st) { st.mode = 'create'; st.wizOpen = true; st.batchId = ''; }
                    if (typeof renderQuotingView === 'function') renderQuotingView();
                } catch (e) {}
            });

            // Bundle open
            content.querySelectorAll('.btn-open-bundle').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const bid = btn.dataset.bid;
                    switchView('quoting');
                    if (typeof openRFQBatchDetail === 'function') openRFQBatchDetail(bid);
                    else if (typeof window.openRFQBatchDetail === 'function') window.openRFQBatchDetail(bid);
                    else if (typeof openBatchDetail === 'function') openBatchDetail(bid);
                });
            });

            // Item open
            content.querySelectorAll('.sd-open-item').forEach(td => {
                td.addEventListener('click', () => {
                    const projId = td.dataset.proj;
                    const dn = td.dataset.dn;
                    if (!projId || !dn) return;
                    // open item detail (by index) - keeps the return view correct
                    const proj = projects.find(p => String(p.id) === String(projId));
                    let idx = -1;
                    if (proj && Array.isArray(proj.items)) {
                        idx = proj.items.findIndex(it => String(it && it.item_drawing_no || '').trim() === String(dn || '').trim());
                    }
                    if (idx >= 0) {
                        try { openItemDetailByRef({ projectId: projId, index: idx, drawingNo: dn }); } catch (e) {
                            currentProject = proj;
                            try { updateProject(currentProject); } catch (e2) {}
                            try { setProjectNameUI(proj && proj.name); } catch (e3) {}
                            try { openDetailWindow(idx); } catch (e4) {}
                        }
                    } else {
                        try { if (typeof openItemInProject === 'function') openItemInProject(projId, dn); } catch (e) {}
                        alert('Item not found in project.');
                    }
                });
            });

            // Custom add/delete
            const customAdd = content.querySelector('#sd-custom-add');
            if (customAdd) customAdd.addEventListener('click', () => {
                const tb = content.querySelector('#sd-custom-tbody');
                if (!tb) return;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><input class="macos-input sd-custom-key" placeholder="Field"/></td>
                    <td><input class="macos-input sd-custom-val" placeholder="Value"/></td>
                    <td style="white-space:nowrap;"><button class="btn-danger sd-custom-del">✕</button></td>
                `;
                tb.appendChild(tr);
                const delBtn = tr.querySelector('.sd-custom-del');
                if (delBtn) delBtn.addEventListener('click', () => tr.remove());
            });
            content.querySelectorAll('.sd-custom-del').forEach(btn => btn.addEventListener('click', () => {
                const tr = btn.closest('tr');
                if (tr) tr.remove();
            }));

            // Notes add
            const noteAdd = content.querySelector('#sd-note-add');
            const noteClear = content.querySelector('#sd-note-clear');
            const noteText = content.querySelector('#sd-note-text');
            const notesList = content.querySelector('#sd-notes-list');
            if (noteClear && noteText) noteClear.addEventListener('click', () => noteText.value = '');
            if (noteAdd && noteText) {
                noteAdd.addEventListener('click', () => {
                    const t = String(noteText.value || '').trim();
                    if (!t) return;
                    if (currentProject && master) {
                        if (!Array.isArray(master.notes_list)) master.notes_list = [];
                        master.notes_list.push({ at: new Date().toISOString().slice(0, 19).replace('T',' '), text: t });
                        upsertSupplierMaster(currentProject, master);
                        updateProject(currentProject);
                    }
                    noteText.value = '';
                    // refresh notes list quickly
                    if (notesList) {
                        const div = document.createElement('div');
                        div.className = 'sd-note';
                        div.innerHTML = `<div class="sd-note-meta">${escapeHtml(new Date().toISOString().slice(0, 19).replace('T',' '))}</div><div class="sd-note-text">${escapeHtml(t)}</div>`;
                        notesList.prepend(div);
                    }
                });
            }

            // Hook close buttons (overlay header/footer)
            const closeX = getEl('btn-close-supplier-detail');
            if (closeX) closeX.onclick = close;
            const closeFooter = getEl('btn-close-supplier-footer');
            if (closeFooter) closeFooter.onclick = close;

            // Initialize resizable and draggable columns for SD tables
            setTimeout(() => {
                initResizableDraggableTable('sd-items-table', 'rfq_sd_items_table_');
                initResizableDraggableTable('sd-rfq-history-table', 'rfq_sd_rfq_history_');
                // Initialize pagination
                initTablePagination('sd-items-table', { storageKey: 'rfq_sd_items_page' });
                initTablePagination('sd-rfq-history-table', { storageKey: 'rfq_sd_rfq_page' });
            }, 100);
        }

        window.openItemInProject = function (projectId, drawingNo) {
    const proj = projects.find(p => p.id == projectId);
    if (!proj) return;

    currentProject = proj;

    const select = getEl('dashboard-project-select');
    if (select) select.value = currentProject.id;

    // Switch to items first (ensure DOM is visible/ready)
    if (typeof switchView === 'function') {
        switchView('items');
    } else {
        const views = ['dashboard', 'items', 'suppliers', 'supplier-list', 'database'];
        views.forEach(v => {
            const el = getEl('view-' + v);
            if (el) el.classList.add('hidden');
            const nav = getEl('nav-' + v);
            if (nav) nav.classList.remove('active');
        });
        const itemsView = getEl('view-items');
        if (itemsView) itemsView.classList.remove('hidden');
        const itemsNav = getEl('nav-items');
        if (itemsNav) itemsNav.classList.add('active');
    }

    // Set header
    setProjectNameUI(proj.name);

    // Re-render after switching view
    updateProject(currentProject);

    // Apply filter after render tick
    requestAnimationFrame(() => {
        const filterInput = getEl('table-filter');
        if (filterInput) {
            filterInput.value = drawingNo || '';
            filterInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
};


        // --- Quoting Process Logic ---

        function renderQuotingView() {
            const st = getQuotingState();

            // Ensure project storage aliases are in shape
            if (currentProject) {
                try { ensureProjectSuppliers(currentProject); } catch (e) {}
                try { syncProjectBatchesIntoMemory(currentProject); } catch (e) {}
            }

            bindQuotingCockpitOnce();
            renderQuotingSuppliersPanel();
            renderQuotingBundlesPanel();

            // Workspace routing
            if (!currentProject) {
                const panel = getEl('quoting-wizard-panel');
                if (panel) panel.innerHTML = '<div class="qt-workspace-empty"><div class="qt-big-icon">📁</div><div class="qt-workspace-title">Select a project first</div></div>';
                return;
            }

            if (st.mode === 'create') {
                if (st.wizOpen) {
                    startRFQWizard(st.supplier || null, []);
                    return;
                }
                // Safety: don't open wizard unless explicitly requested
                st.mode = st.supplier ? 'supplier' : 'home';
            }

            if (st.mode === 'compare') {
                renderQuotingCompare();
                return;
            }

            if (st.batchId) {
                try { openRFQBatchDetail(st.batchId); } catch (e) {}
                return;
            }

            renderQuotingWorkspaceHome();
        }

        // =========================================================
        // Quoting Cockpit helpers (v47)
        // =========================================================
        function getQuotingState() {
            window.__RFQ_QUOTING_STATE__ = window.__RFQ_QUOTING_STATE__ || { supplier: '', batchId: '', mode: 'home', wizOpen: false, compareDn: '', compareTier: 1 };
            const s = window.__RFQ_QUOTING_STATE__;
            s.supplier = String(s.supplier || '').trim();
            s.batchId = String(s.batchId || '').trim();
            s.mode = String(s.mode || 'home').trim();
            s.compareDn = String(s.compareDn || '').trim();
            s.compareTier = parseInt(s.compareTier || 1, 10);
            if (!Number.isFinite(s.compareTier) || s.compareTier < 1) s.compareTier = 1;
            s.wizOpen = !!s.wizOpen;
            return s;
        }

        function renderQuotingWorkspaceHome() {
            const st = getQuotingState();
            const panel = getEl('quoting-wizard-panel');
            if (!panel) return;
            const supTxt = st.supplier ? `Supplier: <b>${escapeHtml(st.supplier)}</b>` : 'Pick a supplier on the left';
            panel.innerHTML = `
                <div class="qt-workspace-empty">
                    <div class="qt-big-icon">🧩</div>
                    <div class="qt-workspace-title">Quoting Cockpit</div>
                    <div class="qt-workspace-sub">${supTxt}</div>
                    <div style="margin-top:10px; display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                        <button class="btn-primary" id="qt-cta-new-bundle" type="button">+ New RFQ Bundle</button>
                        <button class="btn-secondary" id="qt-cta-sync" type="button">Sync</button>
                        <button class="btn-secondary" id="qt-cta-compare" type="button">Compare Quotes</button>
                    </div>
                    <div class="qt-workspace-sub" style="margin-top:10px;">
                        Workflow: <b>Supplier</b> → create <b>Bundle</b> → enter <b>Quote</b> → prices sync into <b>Item Detail → Suppliers & Pricing</b>.
                    </div>
                </div>
            `;
            const ctaNew = panel.querySelector('#qt-cta-new-bundle');
            if (ctaNew) ctaNew.onclick = () => {
                const st2 = getQuotingState();
                st2.mode = 'create';
                st2.wizOpen = true;
                renderQuotingView();
            };
            const ctaCompare = panel.querySelector('#qt-cta-compare');
            if (ctaCompare) ctaCompare.onclick = () => { showView('quote-compare'); };

            const ctaSync = panel.querySelector('#qt-cta-sync');
            if (ctaSync) ctaSync.onclick = () => {
                if (!currentProject) return;
                try { syncAllBatchesToItems(currentProject); } catch (e) {}
                try { updateProject(currentProject); } catch (e) {}
                alert('Synced bundles → items (Suppliers & Pricing).');
            };
        }


        function listQtyTiersFromItem(item) {
            const tiers = [];
            if (!item) return tiers;
            const keys = Object.keys(item).filter(k => /^qty_\d+$/.test(k));
            keys.sort((a,b)=>parseInt(a.split('_')[1],10)-parseInt(b.split('_')[1],10));
            keys.forEach(k => {
                const idx = parseInt(k.split('_')[1],10);
                const v = item[k];
                const num = (v === '' || v === null || typeof v === 'undefined') ? NaN : Number(v);
                if (Number.isFinite(num) && num > 0) tiers.push({ idx, qty: num });
            });
            const maxIdx = tiers.length ? Math.max(...tiers.map(t=>t.idx)) : 0;
            const ensure = Math.max(5, maxIdx);
            for (let i = 1; i <= ensure; i++) {
                if (!tiers.find(t=>t.idx===i)) tiers.push({ idx: i, qty: '' });
            }
            tiers.sort((a,b)=>a.idx-b.idx);
            return tiers;
        }

        function getItemByDrawingNo(project, dn) {
            const key = String(dn || '').trim();
            const arr = project && Array.isArray(project.items) ? project.items : [];
            return arr.find(it => String(it.item_drawing_no || '').trim() === key) || null;
        }

        function getSupplierRecordForItem(item, supplierName) {
            const norm = (v) => String(v || '').trim().toLowerCase();
            const name = String(supplierName || '').trim();
            const list = item && Array.isArray(item.suppliers) ? item.suppliers : [];
            return list.find(s => norm(s && s.name) === norm(name)) || null;
        }

        function getQtyTierKeys(item) {
            if (!item) return ['qty_1','qty_2','qty_3','qty_4','qty_5'];
            const keys = Object.keys(item).filter(k => /^qty_\d+$/.test(k));
            keys.sort((a,b)=>parseInt(a.split('_')[1],10)-parseInt(b.split('_')[1],10));
            const filtered = [];
            keys.forEach(k => {
                const v = item[k];
                const num = (v === '' || v === null || typeof v === 'undefined') ? NaN : Number(v);
                if (Number.isFinite(num) && num > 0) filtered.push(k);
            });
            if (filtered.length === 0) return ['qty_1','qty_2','qty_3','qty_4','qty_5'];
            return filtered;
        }

        function ensureItemAwardShape(item) {
            if (!item) return null;
            if (!item.award || typeof item.award !== 'object') {
                item.award = { mode: 'per_tier', default_tier_key: 'qty_1', tiers: {} };
            }
            if (!item.award.mode) item.award.mode = 'per_tier';
            if (!item.award.tiers || typeof item.award.tiers !== 'object') item.award.tiers = {};
            if (!item.award.default_tier_key) {
                const keys = getQtyTierKeys(item);
                item.award.default_tier_key = keys[0] || 'qty_1';
            }
            return item;
        }

        function getAwardWinnerForTier(item, tierKey) {
            if (!item || !item.award || !item.award.tiers) return '';
            const rec = item.award.tiers[tierKey];
            return rec && rec.supplier_id ? String(rec.supplier_id) : '';
        }

        function setAwardDefaultTier(item, tierKey) {
            ensureItemAwardShape(item);
            item.award.default_tier_key = String(tierKey || 'qty_1');
            projectAwardToSuppliers(item);
        }

        function setAwardWinnerForTier(item, tierKey, supplierName, meta) {
            ensureItemAwardShape(item);
            const tk = String(tierKey || 'qty_1');
            const sup = String(supplierName || '').trim();
            if (!sup) return;
            const now = new Date().toISOString();
            item.award.tiers[tk] = {
                supplier_id: sup,
                decided_at: (meta && meta.decided_at) ? meta.decided_at : now,
                decided_by: (meta && meta.decided_by) ? meta.decided_by : 'user'
            };
            projectAwardToSuppliers(item);
        }

        function setAwardWinnerForAllTiers(item, supplierName, meta) {
            ensureItemAwardShape(item);
            const keys = getQtyTierKeys(item);
            keys.forEach(k => setAwardWinnerForTier(item, k, supplierName, meta));
        }

        function projectAwardToSuppliers(item) {
            if (!item) return;
            ensureItemAwardShape(item);
            if (!Array.isArray(item.suppliers)) item.suppliers = [];

            const defaultTier = String(item.award.default_tier_key || 'qty_1');
            const winner = getAwardWinnerForTier(item, defaultTier);

            // reset main flags; keep feedback if user already set something and we have no winner
            item.suppliers.forEach(s => { s.isMain = false; });

            if (winner) {
                const norm = (v) => String(v || '').trim().toLowerCase();
                item.suppliers.forEach(s => {
                    const isW = norm(s && s.name) === norm(winner);
                    s.isMain = !!isW;
                    if (isW) {
                        s.feedback = 'won';
                        if (!s.status || s.status === 'Quote Received' || s.status === 'RFQ Sent' || s.status === 'Planned') s.status = 'Won';
                    } else {
                        const hasPrice = Object.keys(s || {}).some(k => /^price_\d+$/.test(k) && String(s[k] || '').trim() !== '');
                        if (hasPrice) {
                            s.feedback = 'lost';
                            if (s.status === 'Won') s.status = 'Lost';
                            if (!s.status) s.status = 'Lost';
                        }
                    }
                });

                // legacy
                item.supplier = winner;
                if (!item.status || !['Done','Closed'].includes(String(item.status || ''))) {
                    item.status = 'Won';
                }
            }
        }

        function getSupplierWinsCountForItem(item, supplierName) {
            ensureItemAwardShape(item);
            const sup = String(supplierName || '').trim();
            if (!sup) return { wins: 0, total: 0 };
            const keys = getQtyTierKeys(item);
            let wins = 0;
            keys.forEach(k => { if (getAwardWinnerForTier(item, k) === sup) wins += 1; });
            return { wins, total: keys.length };
        }

                function setItemWinner(project, drawingNo, winnerSupplierName, options) {
            if (!project) return;
            const dn = String(drawingNo || '').trim();
            const winner = String(winnerSupplierName || '').trim();
            const item = getItemByDrawingNo(project, dn);
            if (!item || !winner) return;

            ensureItemAwardShape(item);

            if (!Array.isArray(item.suppliers)) item.suppliers = [];
            const norm = (v) => String(v || '').trim().toLowerCase();
            let wRec = item.suppliers.find(s => norm(s && s.name) === norm(winner));
            if (!wRec) {
                wRec = { name: winner, status: 'Quote Received' };
                item.suppliers.push(wRec);
            }

            const opt = options && typeof options === 'object' ? options : {};
            const tierIdx = opt.tierIdx ? (parseInt(opt.tierIdx, 10) || 0) : 0;
            const tierKey = tierIdx ? `qty_${tierIdx}` : String(item.award.default_tier_key || 'qty_1');

            if (opt.allTiers) {
                setAwardWinnerForAllTiers(item, winner, { decided_by: opt.decided_by || 'user' });
                // if there is no default tier selected, keep current as default
                if (!item.award.default_tier_key) item.award.default_tier_key = tierKey;
            } else {
                setAwardWinnerForTier(item, tierKey, winner, { decided_by: opt.decided_by || 'user' });
                // default tier can be explicitly set or inferred the first time
                if (opt.setDefaultTier || !item.award.default_tier_key) {
                    setAwardDefaultTier(item, tierKey);
                }
            }

            // keep legacy projections consistent
            try {
                const main = getSupplierRecordForItem(item, winner);
                if (main) {
                    if (main.currency) item.currency = main.currency;
                    if (main.incoterms) item.incoterms = main.incoterms;
                    if (main.price_1 !== undefined) item.price_1 = main.price_1;
                    if (main.price_2 !== undefined) item.price_2 = main.price_2;
                }
            } catch (e) {}
        }

        function renderQuotingCompare() {
            const st = getQuotingState();
            const panel = getEl('quoting-wizard-panel');
            if (!panel) return;

            if (!currentProject) {
                panel.innerHTML = '<div class="qt-workspace-empty"><div class="qt-big-icon">📁</div><div class="qt-workspace-title">Select a project first</div></div>';
                return;
            }

            const items = Array.isArray(currentProject.items) ? currentProject.items : [];
            const dns = items.map(it => String(it.item_drawing_no || '').trim()).filter(Boolean).sort((a,b)=>a.localeCompare(b));

            if (!st.compareDn && dns.length) st.compareDn = dns[0];
            const item = getItemByDrawingNo(currentProject, st.compareDn);

            // tiers are always driven by Item Quantities (qty_1..qty_N)
            const tiers = listQtyTiersFromItem(item);
            ensureItemAwardShape(item || {});

            // default tier (for reporting / main winner)
            const defaultTierKey = item && item.award ? String(item.award.default_tier_key || 'qty_1') : 'qty_1';
            const defaultTierIdx = parseInt(defaultTierKey.split('_')[1], 10) || 1;

            // selected tier for evaluation
            if (!st.compareTier) st.compareTier = defaultTierIdx;
            const tierIdx = parseInt(st.compareTier || 1, 10) || 1;
            const tierKey = `qty_${tierIdx}`;

            const suppliers = item && Array.isArray(item.suppliers) ? item.suppliers.slice() : [];
            suppliers.sort((a,b)=>String(a.name||'').localeCompare(String(b.name||'')));

            const defaultTierLabel = (() => {
                const t = tiers.find(x => x.idx === defaultTierIdx);
                const q = t && t.qty ? String(t.qty) : '';
                return q ? `Q${defaultTierIdx}: ${q}` : `Q${defaultTierIdx}`;
            })();

            panel.innerHTML = `
                <div class="qt-compare-wrap">
                    <div class="qt-compare-header">
                        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                            <div style="font-weight:800;">📊 Quote Comparison</div>
                            <span class="qt-pill gray">Project: ${escapeHtml(currentProject.name || '')}</span>
                            <span class="qt-pill gray">Default tier: ${escapeHtml(defaultTierLabel)}</span>
                        </div>
                        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                            <button class="btn-secondary" id="qt-compare-back" type="button">← Back</button>
                            <button class="btn-secondary" id="qt-compare-sync" type="button">Sync</button>
                        </div>
                    </div>

                    <div class="qt-compare-controls">
                        <div class="form-row">
                            <label>Item</label>
                            <select id="qt-compare-item" class="macos-input">
                                ${dns.map(d => `<option value="${escapeHtml(d)}" ${d===st.compareDn?'selected':''}>${escapeHtml(d)}</option>`).join('')}
                            </select>
                        </div>

                        <div class="form-row">
                            <label>Qty tier (evaluate)</label>
                            <div style="display:flex; gap:8px; align-items:center;">
                                <select id="qt-compare-tier" class="macos-input" style="min-width:190px;">
                                    ${tiers.map(t => {
                                        const label = t.qty ? `Q${t.idx}: ${t.qty}` : `Q${t.idx}`;
                                        const isSel = t.idx === tierIdx;
                                        const isDef = t.idx === defaultTierIdx;
                                        return `<option value="${t.idx}" ${isSel?'selected':''}>${escapeHtml(label)}${isDef?'  (default)':''}</option>`;
                                    }).join('')}
                                </select>
                                <button class="btn-secondary btn-mini" id="qt-compare-set-default" type="button">Set as default</button>
                            </div>
                        </div>

                        <div class="form-row" style="flex:1;">
                            <label>Description</label>
                            <input class="macos-input" type="text" value="${escapeHtml(String((item && item.description) || ''))}" disabled>
                        </div>
                    </div>

                    <div class="qt-compare-body">
                        ${suppliers.length ? `
                        <table class="rfq-table qt-compare-table">
                            <thead>
                                <tr>
                                    <th>Supplier</th>
                                    <th>RFQ Bundles</th>
                                    <th>Tier winner</th>
                                    <th>Wins</th>
                                    <th>Status</th>
                                    <th>Currency</th>
                                    <th>Incoterms</th>
                                    <th>Lead time</th>
                                    <th>MOQ</th>
                                    <th>Price @ tier</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${suppliers.map(s => {
                                    const name = String(s.name || '').trim();
                                    const status = String(s.status || '').trim();
                                    const cur = String(s.currency || '').trim();
                                    const inc = String(s.incoterms || '').trim();
                                    const lt = String(s.lead_time || s.leadtime || '').trim();
                                    const moq = String(s.moq || '').trim();
                                    const pKey = `price_${tierIdx}`;
                                    const price = (s && s[pKey] !== undefined) ? s[pKey] : '';
                                    const priceTxt = (price === '' || price === null || typeof price === 'undefined') ? '' : String(price);

                                    const tierWinner = item ? getAwardWinnerForTier(item, tierKey) : '';
                                    const defWinner = item ? getAwardWinnerForTier(item, defaultTierKey) : '';
                                    const isTierWinner = tierWinner && String(tierWinner).trim() === name;
                                    const isDefaultWinner = defWinner && String(defWinner).trim() === name;

                                    const wins = item ? getSupplierWinsCountForItem(item, name) : { wins: 0, total: 0 };
                                    const winsTxt = wins.total ? `${wins.wins}/${wins.total}` : '';

                                    const badgeTier = isTierWinner ? '<span class="qt-badge ok">Winner</span>' : '';
                                    const badgeMain = isDefaultWinner ? '<span class="qt-badge warn">Main</span>' : '';

                                    // RFQ bundles related to this supplier + item
                                    let bundlesCell = '';
                                    try {
                                        const rel = getProjectBatches(currentProject).filter(b => {
                                            const bn = String(b && (b.supplier_name || b.supplier) || '').trim();
                                            if (bn !== name) return false;
                                            return (b.items || []).some(x => String(x && (x.drawing_no || x.item_drawing_no || '') || '').trim() === String(st.compareDn || '').trim());
                                        }).sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||'')));
                                        if (rel.length) {
                                            const firstId = String(rel[0].id || '').trim();
                                            bundlesCell = `<button class="btn-secondary btn-mini" data-action="qt-open-bundle" data-batch-id="${escapeHtml(firstId)}" type="button">Open (${rel.length})</button>`;
                                        } else {
                                            bundlesCell = '<span class="muted">—</span>';
                                        }
                                    } catch (e) { bundlesCell = '<span class="muted">—</span>'; }

                                    return `
                                        <tr class="${isDefaultWinner ? 'qt-row-main' : ''}">
                                            <td>${escapeHtml(name)} ${badgeMain}</td>
                                            <td>${bundlesCell}</td>
                                            <td>${badgeTier}</td>
                                            <td>${escapeHtml(winsTxt)}</td>
                                            <td>${escapeHtml(status)}</td>
                                            <td>${escapeHtml(cur)}</td>
                                            <td>${escapeHtml(inc)}</td>
                                            <td>${escapeHtml(lt)}</td>
                                            <td>${escapeHtml(moq)}</td>
                                            <td style="font-weight:700;">${escapeHtml(priceTxt)}</td>
                                            <td style="white-space:nowrap;">
                                                <button class="btn-primary btn-mini" data-action="qt-set-winner-tier" data-tier="${tierIdx}" data-dn="${encodeURIComponent(st.compareDn)}" data-supplier-enc="${encodeURIComponent(name)}" type="button">Win tier</button>
                                                <button class="btn-secondary btn-mini" data-action="qt-set-winner-all" data-dn="${encodeURIComponent(st.compareDn)}" data-supplier-enc="${encodeURIComponent(name)}" type="button">Win all</button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                        ` : `<div class="qt-empty" style="margin:14px;">No supplier quotes on this item yet.</div>`}
                    </div>
                </div>
            `;

            const btnBack = panel.querySelector('#qt-compare-back');
            if (btnBack) btnBack.onclick = () => { const s2 = getQuotingState(); s2.mode = 'home'; renderQuotingView(); };

            const btnSync = panel.querySelector('#qt-compare-sync');
            if (btnSync) btnSync.onclick = () => {
                if (!currentProject) return;
                try { syncAllBatchesToItems(currentProject); } catch (e) {}
                try { updateProject(currentProject); } catch (e) {}
                renderQuotingCompare();
            };

            const btnSetDefault = panel.querySelector('#qt-compare-set-default');
            if (btnSetDefault) btnSetDefault.onclick = () => {
                if (!currentProject) return;
                const it = getItemByDrawingNo(currentProject, st.compareDn);
                if (!it) return;
                setAwardDefaultTier(it, `qty_${tierIdx}`);
                try { updateProject(currentProject); } catch (e) {}
                renderQuotingCompare();
            };

            const selItem = panel.querySelector('#qt-compare-item');
            if (selItem) selItem.onchange = () => {
                const s2 = getQuotingState();
                s2.compareDn = String(selItem.value || '').trim();
                renderQuotingCompare();
            };

            const selTier = panel.querySelector('#qt-compare-tier');
            if (selTier) selTier.onchange = () => {
                const s2 = getQuotingState();
                s2.compareTier = parseInt(selTier.value || 1, 10) || 1;
                renderQuotingCompare();
            };
        }


function setQuotingSupplier(name) {
            const st = getQuotingState();
            const keepWizard = (st.mode === 'create' && st.wizOpen);
            st.supplier = String(name || '').trim();
            st.batchId = '';
            if (!keepWizard) st.mode = st.supplier ? 'supplier' : 'home';
            renderQuotingView();
        }

        function setQuotingBatch(batchId) {
            const st = getQuotingState();
            st.batchId = String(batchId || '').trim();
            st.wizOpen = false;
            st.mode = st.batchId ? 'bundle' : (st.supplier ? 'supplier' : 'home');
            renderQuotingView();
        }


// =========================================================
// RFQ Bundle Detail (full page)
// =========================================================
window.__RFQ_BUNDLE_DETAIL__ = window.__RFQ_BUNDLE_DETAIL__ || { batchId: '', returnView: 'quoting', edit: null };

function openBundleDetailPage(batchId, returnView = 'quoting') {
    const st = window.__RFQ_BUNDLE_DETAIL__ || { batchId: '', returnView: 'quoting', edit: null };
    st.batchId = String(batchId || '').trim();
    st.returnView = String(returnView || 'quoting').trim() || 'quoting';
    st.edit = null; // force reload
    window.__RFQ_BUNDLE_DETAIL__ = st;
    switchView('bundle-detail');
}

function bundleFindBatch(project, batchId) {
    if (!project || !batchId) return null;
    const batches = (window.RFQData && typeof window.RFQData.getRFQBatches === 'function') ? window.RFQData.getRFQBatches(project.id) : [];
    return (batches || []).find(b => String(b && b.id) === String(batchId)) || null;
}

function bundleDeepClone(obj) {
    try { return JSON.parse(JSON.stringify(obj)); } catch (e) { return obj ? { ...obj } : null; }
}

function bundleItemLookup(project) {
    const map = new Map();
    (project && Array.isArray(project.items) ? project.items : []).forEach(it => {
        const dn = String(it.item_drawing_no || '').trim();
        if (dn) map.set(dn, it);
    });
    return map;
}

function supplierRecForItem(item, supplierName) {
    const norm = (v) => String(v || '').trim().toLowerCase();
    const target = norm(supplierName);
    const list = (item && Array.isArray(item.suppliers)) ? item.suppliers : [];
    return list.find(s => norm(s && s.name) === target) || null;
}

function renderBundleDetailPage() {
    const st = clearlyGetBundleState();
    const content = (typeof bundleDetailPageContent !== 'undefined' && bundleDetailPageContent) ? bundleDetailPageContent : document.getElementById('bundle-detail-page-content');
    const titleEl = (typeof bundleDetailPageTitle !== 'undefined' && bundleDetailPageTitle) ? bundleDetailPageTitle : document.getElementById('bundle-detail-page-title');
    if (!content) return;

    if (!currentProject || !st.batchId) {
        if (titleEl) titleEl.textContent = 'RFQ Bundle';
        content.innerHTML = '<div class="main-card"><div class="muted">Select a project and open an RFQ bundle.</div></div>';
        return;
    }

    const batch = bundleFindBatch(currentProject, st.batchId);
    if (!batch) {
        if (titleEl) titleEl.textContent = 'RFQ Bundle';
        content.innerHTML = '<div class="main-card"><div class="muted">Bundle not found.</div></div>';
        return;
    }

    if (!st.edit) st.edit = bundleDeepClone(batch);
    const b = st.edit;

    const supplierName = String(b.supplier_name || b.supplier || '').trim();
    const created = b.created_at ? new Date(b.created_at).toLocaleString() : '';
    const updated = b.updated_at ? new Date(b.updated_at).toLocaleString() : '';
    const status = String(b.status || 'Draft').trim() || 'Draft';

    if (titleEl) titleEl.textContent = `RFQ Bundle — ${supplierName || 'Supplier'}`;

    const itemsMap = bundleItemLookup(currentProject);

    // Build table rows
    const lines = Array.isArray(b.items) ? b.items : [];
    const rows = lines.map((ln, idx) => {
        const dn = String(ln.drawing_no || '').trim();
        const it = itemsMap.get(dn);
        const desc = it ? String(it.description || it.desc || '') : '';
        const mfr = it ? String(it.manufacturer || it.mfr || '') : '';
        const mpn = it ? String(it.mpn || it.part_no || '') : '';
        const supRec = it ? supplierRecForItem(it, supplierName) : null;

        const tiers = it ? getItemQtyTiers(it, { includeBlanks: false }) : [];
        const qtyKeys = (tiers && tiers.length) ? tiers.map(t => ({ k: `qty_${t.index}`, v: t.value })) : [{ k: 'qty_1', v: (it && (it.qty_1 ?? it.qty ?? '')) ?? '' }];

        const qtyCells = qtyKeys.map(t => `<div class="qt-mini">${escapeHtml(String(t.v || ''))}</div>`).join('');
        const pCells = qtyKeys.map(t => {
            const pk = `price_${String(t.k).split('_')[1]}`;
            const val = (ln && ln[pk] !== undefined) ? ln[pk] : '';
            return `<input class="macos-input qt-mini-input" data-bline="${idx}" data-field="${pk}" value="${escapeHtml(String(val ?? ''))}" placeholder="Price">`;
        }).join('');

        const moq = (ln && ln.moq !== undefined) ? ln.moq : (supRec ? (supRec.moq || '') : '');
        const mov = (ln && ln.mov !== undefined) ? ln.mov : (supRec ? (supRec.mov || '') : '');
        const lt = (ln && ln.lead_time_days !== undefined) ? ln.lead_time_days : (supRec ? (supRec.lead_time_days || supRec.lead_time || '') : '');
        const ship = (ln && ln.shipping_cost !== undefined) ? ln.shipping_cost : (supRec ? (supRec.shipping || supRec.shipping_cost || '') : '');
        const terms = (ln && ln.payment_terms !== undefined) ? ln.payment_terms : (supRec ? (supRec.payment_terms || supRec.terms || '') : '');

        const qStatus = String(ln.quote_status || 'Requested');

        return `
            <tr>
                <td><b>${escapeHtml(dn)}</b><div class="muted">${escapeHtml(mpn)}</div></td>
                <td>${escapeHtml(desc)}</td>
                <td style="white-space:nowrap;">${qtyCells}</td>
                <td>${escapeHtml(mfr)}</td>
                <td style="min-width:200px;">
                    <div class="qt-grid-qty">${pCells}</div>
                    <div class="qt-line-meta">
                        <span class="qt-mini-label">Status</span>
                        <select class="macos-input qt-mini-input" data-bline="${idx}" data-field="quote_status">
                            ${['Requested','Quoted','No Bid','Need Info'].map(s => `<option value="${escapeHtml(s)}" ${s===qStatus?'selected':''}>${escapeHtml(s)}</option>`).join('')}
                        </select>
                        <span class="qt-mini-label">MOQ</span>
                        <input class="macos-input qt-mini-input" data-bline="${idx}" data-field="moq" value="${escapeHtml(String(moq ?? ''))}" style="width:90px;">
                        <span class="qt-mini-label">MOV</span>
                        <input class="macos-input qt-mini-input" data-bline="${idx}" data-field="mov" value="${escapeHtml(String(mov ?? ''))}" style="width:90px;">
                        <span class="qt-mini-label">LT</span>
                        <input class="macos-input qt-mini-input" data-bline="${idx}" data-field="lead_time_days" value="${escapeHtml(String(lt ?? ''))}" style="width:90px;" placeholder="days">
                        <span class="qt-mini-label">Ship</span>
                        <input class="macos-input qt-mini-input" data-bline="${idx}" data-field="shipping_cost" value="${escapeHtml(String(ship ?? ''))}" style="width:120px;">
                        <span class="qt-mini-label">Terms</span>
                        <input class="macos-input qt-mini-input" data-bline="${idx}" data-field="payment_terms" value="${escapeHtml(String(terms ?? ''))}" style="width:160px;">
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    content.innerHTML = `
        <div class="main-card">
            <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;">
                <div>
                    <div style="font-weight:800; font-size:16px;">${escapeHtml(currentProject.name || '')}</div>
                    <div class="muted" style="margin-top:4px;">Created: ${escapeHtml(created)}${updated ? ' • Updated: ' + escapeHtml(updated) : ''}</div>
                </div>
                <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                    <div class="form-row" style="min-width:220px;">
                        <label>Status</label>
                        <select id="bd-status" class="macos-input">
                            ${['Draft','Sent','Quote Received','Closed','Zrušitled'].map(s => `<option value="${escapeHtml(s)}" ${s===status?'selected':''}>${escapeHtml(s)}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-row" style="min-width:160px;">
                        <label>Due date</label>
                        <input id="bd-due" type="date" class="macos-input" value="${escapeHtml(String(b.due_date || ''))}">
                    </div>
                    <div class="form-row" style="min-width:120px;">
                        <label>Rev</label>
                        <input id="bd-rev" type="text" class="macos-input" value="${escapeHtml(String(b.revision || ''))}">
                    </div>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px;">
                <div class="form-row">
                    <label>Currency</label>
                    <input id="bd-currency" type="text" class="macos-input" value="${escapeHtml(String(b.currency || ''))}">
                </div>
                <div class="form-row">
                    <label>Incoterms</label>
                    <input id="bd-incoterms" type="text" class="macos-input" value="${escapeHtml(String(b.incoterms || ''))}">
                </div>
                <div class="form-row">
                    <label>Contact</label>
                    <input id="bd-contact" type="text" class="macos-input" value="${escapeHtml(String(b.contact_person || ''))}">
                </div>
                <div class="form-row">
                    <label>Email</label>
                    <input id="bd-email" type="text" class="macos-input" value="${escapeHtml(String(b.contact_email || ''))}">
                </div>
                <div class="form-row" style="grid-column: 1 / -1;">
                    <label>Notes</label>
                    <textarea id="bd-notes" class="macos-input" style="height:60px; resize:vertical;">${escapeHtml(String(b.notes || ''))}</textarea>
                </div>
            </div>
        </div>

        <div class="main-card" style="margin-top: 12px;">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
                <div style="font-weight:800;">Items</div>
                <div class="muted">${lines.length} lines</div>
            </div>

            <div class="table-wrapper" style="margin-top: 10px;">
                <table class="rfq-table">
                    <thead>
                        <tr>
                            <th style="width:160px;">Item</th>
                            <th>Description</th>
                            <th style="width:140px;">Qty tiers</th>
                            <th style="width:120px;">Mfr</th>
                            <th>Quote (tiers + extras)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows || `<tr><td colspan="5" style="padding:14px; color:#999; text-align:center;">No items in bundle</td></tr>`}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // Bind controls
    if (btnBundleDetailBack) btnBundleDetailBack.onclick = () => {
        const s = clearlyGetBundleState();
        if ((s.returnView || '') === 'quote-compare') { showView('quote-compare'); return; }
        switchView(s.returnView || 'quoting');
    };

    if (btnBundleDetailExport) btnBundleDetailExport.onclick = () => {
        try { exportBatchCSV(b); } catch (e) { alert('Export failed: ' + (e && e.message ? e.message : String(e))); }
    };

    if (btnBundleDetailDelete) btnBundleDetailDelete.onclick = () => {
        if (!confirm('Delete this RFQ bundle?')) return;
        try {
            if (window.RFQData && typeof window.RFQData.deleteRFQBatch === 'function') {
                window.RFQData.deleteRFQBatch(currentProject.id, b.id);
                syncProjectBatchesIntoMemory(currentProject);
                updateProject(currentProject);
            }
        } catch (e) {}
        switchView(st.returnView || 'quoting');
        try { renderQuotingView(); } catch (e) {}
    };

    if (btnBundleDetailSave) btnBundleDetailSave.onclick = () => {
        try {
            // Header fields
            const getVal = (id) => {
                const el = document.getElementById(id);
                return el ? el.value : '';
            };
            b.status = getVal('bd-status') || b.status || 'Draft';
            b.due_date = getVal('bd-due') || '';
            b.revision = getVal('bd-rev') || '';
            b.currency = getVal('bd-currency') || '';
            b.incoterms = getVal('bd-incoterms') || '';
            b.contact_person = getVal('bd-contact') || '';
            b.contact_email = getVal('bd-email') || '';
            const notesEl = document.getElementById('bd-notes');
            b.notes = notesEl ? notesEl.value : (b.notes || '');

            // Line edits (already stored in st.edit by delegation below)

            const saved = (window.RFQData && typeof window.RFQData.saveRFQBatch === 'function') ? window.RFQData.saveRFQBatch(currentProject.id, b) : b;

            // Sync into item suppliers/pricing
            try {
                const mode = (String(saved.status || '') === 'Sent') ? 'sent' : (String(saved.status || '') === 'Quote Received' ? 'received' : 'save');
                applyBatchToItems(currentProject, saved, mode);
            } catch (e) {}

            syncProjectBatchesIntoMemory(currentProject);
            updateProject(currentProject);

            alert('Saved.');
            // refresh edit copy from latest
            st.edit = bundleDeepClone(saved);
            renderBundleDetailPage();
        } catch (e) {
            console.error(e);
            alert('Save failed: ' + (e && e.message ? e.message : String(e)));
        }
    };

    // Delegated line editing
    content.querySelectorAll('[data-bline][data-field]').forEach(el => {
        el.onchange = () => {
            try {
                const idx = parseInt(el.getAttribute('data-bline') || '0', 10) || 0;
                const field = String(el.getAttribute('data-field') || '');
                if (!field) return;
                if (!Array.isArray(b.items)) b.items = [];
                if (!b.items[idx]) return;
                b.items[idx][field] = el.value;
            } catch (e) {}
        };
    });
}


function renderQuoteComparePage() {
    const content = document.getElementById('quote-compare-page-content');
    if (!content) return;

    if (!currentProject) {
        content.innerHTML = '<div class="main-card"><div class="muted">Select a project to use Quote Comparison.</div></div>';
        return;
    }

    // Back button
    try {
        const btnBack = document.getElementById('btn-quote-compare-back');
        if (btnBack) btnBack.onclick = () => { showView('quoting'); };
    } catch (e) {}

    const itemsRaw = Array.isArray(currentProject.items) ? currentProject.items : (currentProject.data && Array.isArray(currentProject.data.items) ? currentProject.data.items : []);
    if (!itemsRaw.length) {
        content.innerHTML = '<div class="main-card"><div class="muted">No items in this project.</div></div>';
        return;
    }

    const getItemKeyLocal = (it, idx) => {
        const k = String(
            it.item_drawing_no ||
            it.drawing_no ||
            it.part_no ||
            it.part_number ||
            it.item_no ||
            it.mpn ||
            it.id ||
            ''
        ).trim();
        return k || ('row_' + idx);
    };

    const items = itemsRaw.map((it, idx) => ({
        _idx: idx,
        key: getItemKeyLocal(it, idx),
        dn: String(it.item_drawing_no || it.drawing_no || it.part_no || it.part_number || it.item_no || it.mpn || '').trim() || ('row_' + (idx+1)),
        description: String(it.description || it.desc || '').trim(),
        _raw: it
    }));

    // Selected DN + tier state (stored)
    const stKeyDn = 'rfq_qc_dn';
    const stKeyTier = 'rfq_qc_tier';
    let selDn = String(localStorage.getItem(stKeyDn) || '').trim();
    if (!selDn || !items.some(x => x.dn === selDn)) selDn = items[0].dn;

    // Determine tiers from selected item
    const selItem = items.find(x => x.dn === selDn) || items[0];
    const tiers = getItemQtyTiers(selItem._raw, { includeBlanks: false }) || [];
    const tierKeys = (tiers && tiers.length) ? tiers.map(t => String(t.k || t.key || '').trim()).filter(Boolean) : ['qty_1'];
    let selTier = String(localStorage.getItem(stKeyTier) || '').trim();
    if (!selTier || !tierKeys.includes(selTier)) selTier = tierKeys[0];

    // Suppliers list: prefer master list
    const master = Array.isArray(currentProject.supplierMaster) ? currentProject.supplierMaster : [];
    let suppliers = master.map(s => String(s.name || s.supplier || '').trim()).filter(Boolean);
    if (!suppliers.length) {
        // fallback: infer from item supplier pricing
        const set = new Set();
        itemsRaw.forEach(it => {
            (it && Array.isArray(it.suppliers) ? it.suppliers : []).forEach(s => {
                const nm = String(s && (s.name || s.supplier || s.supplier_name || '')).trim();
                if (nm) set.add(nm);
            });
        });
        suppliers = Array.from(set);
    }
    suppliers.sort((a,b)=>a.localeCompare(b));

    const batches = Array.isArray(currentProject.rfqBatches) ? currentProject.rfqBatches : (Array.isArray(currentProject.rfq_batches) ? currentProject.rfq_batches : []);

    const readLinePrice = (ln, tierKey) => {
        // tierKey like qty_1 => price_1
        const idx = String(tierKey).split('_')[1] || '1';
        const pk = 'price_' + idx;
        return (ln && ln[pk] !== undefined) ? ln[pk] : '';
    };

    const rows = suppliers.map(supplierName => {
        const related = batches.filter(b => norm(String(b && (b.supplier || b.supplier_name || b.name || ''))) === norm(supplierName));
        const relatedWithLine = related.map(b => {
            const lines = Array.isArray(b.lines) ? b.lines : [];
            const ln = lines.find(x => norm(String(x && (x.drawing_no || x.item_drawing_no || x.part_no || x.mpn || ''))) === norm(selDn));
            return { b, ln };
        }).filter(x => !!x.ln);

        // Best price across batches for this supplier
        let best = null;
        relatedWithLine.forEach(({b, ln}) => {
            const p = readLinePrice(ln, selTier);
            const pn = Number(String(p).replace(',', '.'));
            if (!isNaN(pn) && pn > 0) {
                if (!best || pn < best.pn) best = { pn, p, b, ln };
            }
        });

        // Use last batch info for meta
        const last = relatedWithLine.length ? relatedWithLine[relatedWithLine.length - 1] : null;
        const ln = best ? best.ln : (last ? last.ln : null);
        const b = best ? best.b : (last ? last.b : null);

        const status = ln ? String(ln.quote_status || ln.status || 'Requested') : '—';
        const moq = ln ? (ln.moq ?? '') : '';
        const lt = ln ? (ln.lead_time_days ?? ln.lead_time ?? '') : '';
        const curr = b ? String(b.currency || '') : '';
        const price = best ? best.p : (ln ? readLinePrice(ln, selTier) : '');

        const batchId = b ? String(b.id || b.batchId || b.batch_id || '') : '';
        const open = batchId ? `<button class="btn-secondary qc-open-bundle" data-bid="${escapeHtml(batchId)}" type="button">Open bundle</button>` : '';

        return `
            <tr>
                <td><b>${escapeHtml(supplierName)}</b><div class="muted">${escapeHtml(batchId ? ('Bundle: ' + batchId) : '')}</div></td>
                <td>${escapeHtml(String(status))}</td>
                <td>${escapeHtml(String(moq))}</td>
                <td>${escapeHtml(String(lt))}</td>
                <td><b>${escapeHtml(String(price))}</b></td>
                <td>${escapeHtml(String(curr))}</td>
                <td>${open}</td>
            </tr>
        `;
    }).join('');

    content.innerHTML = `
        <div class="main-card">
            <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;">
                <div>
                    <div style="font-weight:800;">📊 Quote Comparison</div>
                    <div class="muted" style="margin-top:4px;">Project: ${escapeHtml(String(currentProject.name || ''))}</div>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button class="btn-secondary" id="qc-sync" type="button">Sync</button>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 220px; gap: 12px; margin-top: 12px;">
                <div class="form-row">
                    <label>Item</label>
                    <select id="qc-item" class="macos-input">
                        ${items.map(it => `<option value="${escapeHtml(it.dn)}" ${it.dn===selDn?'selected':''}>${escapeHtml(it.dn)}${it.description?(' — ' + escapeHtml(it.description.slice(0,60))):''}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <label>Qty tier</label>
                    <select id="qc-tier" class="macos-input">
                        ${tierKeys.map(k => `<option value="${escapeHtml(k)}" ${k===selTier?'selected':''}>${escapeHtml(k.replace('qty_','Q'))}</option>`).join('')}
                    </select>
                </div>
            </div>

            <div style="margin-top:12px; overflow:auto; border:1px solid rgba(0,0,0,.08); border-radius:12px; background:#fff;">
                <table class="rfq-table" style="width:100%; background:#fff;">
                    <thead>
                        <tr>
                            <th>Supplier</th>
                            <th style="width:120px;">Status</th>
                            <th style="width:90px;">MOQ</th>
                            <th style="width:90px;">LT</th>
                            <th style="width:120px;">Price</th>
                            <th style="width:90px;">Curr</th>
                            <th style="width:140px;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows || `<tr><td colspan="7" class="muted" style="padding:14px;">No supplier quotes found for this item.</td></tr>`}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    const elItem = document.getElementById('qc-item');
    const elTier = document.getElementById('qc-tier');
    if (elItem) elItem.onchange = () => {
        localStorage.setItem(stKeyDn, String(elItem.value || '').trim());
        renderQuoteComparePage();
    };
    if (elTier) elTier.onchange = () => {
        localStorage.setItem(stKeyTier, String(elTier.value || '').trim());
        renderQuoteComparePage();
    };

    const btnSync = document.getElementById('qc-sync');
    if (btnSync) btnSync.onclick = () => { try { syncToServerThrottled(); } catch (e) {} };

    // open bundle
    content.querySelectorAll('.qc-open-bundle').forEach(btn => {
        btn.onclick = () => {
            const bid = btn.getAttribute('data-bid') || '';
            if (!bid) return;
            const st = clearlyGetBundleState();
            st.batchId = bid;
            st.returnView = 'quote-compare';
            showView('bundle-detail');
        };
    });
}


function clearlyGetBundleState(){
    window.__RFQ_BUNDLE_DETAIL__ = window.__RFQ_BUNDLE_DETAIL__ || { batchId:'', returnView:'quoting', edit: null };
    const st = window.__RFQ_BUNDLE_DETAIL__;
    st.batchId = String(st.batchId || '').trim();
    st.returnView = String(st.returnView || 'quoting').trim() || 'quoting';
    return st;
}

        function deriveAllSupplierNamesForProject(project) {
            if (!project) return [];
            ensureProjectSuppliers(project);
            const set = new Set();

            (project.supplierMaster || []).forEach(sm => {
                const n = String(sm && sm.name || '').trim();
                if (n) set.add(n);
            });

            (project.items || []).forEach(it => {
                const main = String(it.supplier || '').trim();
                if (main) set.add(main);
                (it.suppliers || []).forEach(s => {
                    const n = String(s && s.name || '').trim();
                    if (n) set.add(n);
                });
            });

            getProjectBatches(project).forEach(b => {
                const n = String(b && (b.supplier_name || b.supplier) || '').trim();
                if (n) set.add(n);
            });

            return Array.from(set).sort((a,b)=>a.localeCompare(b));
        }

function normalizeSupplierKey(val) {
            return String(val || '').trim().toLowerCase();
        }

function buildSupplierMasterMaps(project) {
            const idToName = {};
            const nameToId = {};
            try {
                (project && project.supplierMaster || []).forEach(sm => {
                    const id = String(sm && (sm.master_id || sm.id || sm.code) || '').trim();
                    const name = String(sm && sm.name || '').trim();
                    if (id && name) {
                        idToName[id] = name;
                        nameToId[normalizeSupplierKey(name)] = id;
                    } else if (name) {
                        nameToId[normalizeSupplierKey(name)] = id || '';
                    }
                });
            } catch (e) {}
            return { idToName, nameToId };
        }

function resolveSupplierName(project, supplierRec) {
            if (!supplierRec) return '';
            const n = String(supplierRec.name || supplierRec.supplier_name || '').trim();
            if (n) return n;
            const id = String(supplierRec.master_id || supplierRec.id || '').trim();
            if (!id) return '';
            try {
                const maps = buildSupplierMasterMaps(project);
                return String(maps.idToName[id] || '').trim();
            } catch (e) { return ''; }
        }

function ensureProjectSupplierLinks(project) {
            if (!project) return;
            try { ensureProjectSuppliers(project); } catch (e) {}
            const maps = buildSupplierMasterMaps(project);
            // Fill missing supplier names in items.suppliers from master_id mapping (non-destructive)
            (project.items || []).forEach(it => {
                if (!it) return;
                if (!Array.isArray(it.suppliers)) it.suppliers = [];
                (it.suppliers || []).forEach(s => {
                    if (!s) return;
                    const hasName = String(s.name || '').trim();
                    if (hasName) return;
                    const id = String(s.master_id || s.id || '').trim();
                    if (id && maps.idToName[id]) s.name = maps.idToName[id];
                });
            });
        }

function supplierRecMatches(project, supplierRec, supplierName) {
            const target = normalizeSupplierKey(supplierName);
            if (!target) return false;
            if (!supplierRec) return false;
            const recName = normalizeSupplierKey(resolveSupplierName(project, supplierRec) || supplierRec.name || '');
            if (recName && recName === target) return true;

            // If supplierName corresponds to a master_id, compare master_id as well
            try {
                const maps = buildSupplierMasterMaps(project);
                const targetId = maps.nameToId[target] || '';
                const recId = String(supplierRec.master_id || supplierRec.id || '').trim();
                if (targetId && recId && targetId === recId) return true;
            } catch (e) {}
            return false;
        }



        function getSupplierStats(project, supplierName) {
            const name = String(supplierName || '').trim();
            const norm = (v) => String(v || '').trim().toLowerCase();

            const itemsAll = project && Array.isArray(project.items) ? project.items : [];
            const batches = getProjectBatches(project);

            let targets = 0;
            let planned = 0;
            let rfqSent = 0;
            let quoteReceived = 0;

            itemsAll.forEach(it => {
                const sList = Array.isArray(it.suppliers) ? it.suppliers : [];
                const sup = sList.find(s => supplierRecMatches(project, s, name));
                if (sup) {
                    targets += 1;
                    const st = String(sup.status || '').trim();
                    if (st === 'Planned') planned += 1;
                    if (st === 'RFQ Sent') rfqSent += 1;
                    if (st === 'Quote Received') quoteReceived += 1;
                } else if (norm(it.supplier) === norm(name)) {
                    targets += 1;
                }
            });

            let bundleCount = 0;
            let openBundles = 0;
            batches.forEach(b => {
                const bn = String(b && (b.supplier_name || b.supplier) || '').trim();
                if (norm(bn) !== norm(name)) return;
                bundleCount += 1;
                const st = String(b.status || 'Draft').trim();
                if (!['Closed','Zrušitled'].includes(st)) openBundles += 1;
            });

            return { targets, planned, rfqSent, quoteReceived, bundleCount, openBundles };
        }

        function renderQuotingSuppliersPanel() {
            const box = getEl('quoting-suppliers-list');
            const countEl = getEl('qt-suppliers-count');
            const btnDetail = getEl('btn-qt-supplier-detail');
            if (!box) return;

            if (!currentProject) {
                if (countEl) countEl.textContent = '0';
                box.innerHTML = '<div class="qt-empty">Select a project first</div>';
                if (btnDetail) btnDetail.disabled = true;
                return;
            }

            try { ensureProjectSupplierLinks(currentProject); } catch (e) {}
            const st = getQuotingState();
            const fEl = getEl('qt-supplier-filter');
            const filter = String((fEl && fEl.value) || '').trim().toLowerCase();

            const suppliers = deriveAllSupplierNamesForProject(currentProject).filter(n => !filter || n.toLowerCase().includes(filter));
            if (countEl) countEl.textContent = String(suppliers.length);
            if (btnDetail) btnDetail.disabled = !st.supplier;

            if (suppliers.length === 0) {
                box.innerHTML = '<div class="qt-empty">No suppliers found</div>';
                return;
            }

            box.innerHTML = suppliers.map(name => {
                const stats = getSupplierStats(currentProject, name);
                const active = st.supplier && String(st.supplier).trim().toLowerCase() === String(name).trim().toLowerCase();
                const badge = stats.openBundles > 0 ? `<span class="qt-badge warn">Open ${stats.openBundles}</span>` : `<span class="qt-badge gray">No open</span>`;
                const meta = `${stats.targets} targets • ${stats.bundleCount} bundles`;
                const idEnc = encodeURIComponent(name);
                return `
                    <div class="qt-supplier-row ${active ? 'active' : ''}" data-action="qt-select-supplier" data-supplier-enc="${idEnc}">
                        <div class="qt-row-top">
                            <div class="qt-row-title">${escapeHtml(name)}</div>
                            ${badge}
                        </div>
                        <div class="qt-row-meta">
                            <span>${escapeHtml(meta)}</span>
                            ${stats.quoteReceived ? `<span class="qt-badge ok">Quote ${stats.quoteReceived}</span>` : ``}
                            ${stats.rfqSent ? `<span class="qt-badge gray">Sent ${stats.rfqSent}</span>` : ``}
                        </div>
                    </div>
                `;
            }).join('');
        }

        function renderQuotingBundlesPanel() {
            const list = getEl('quoting-history-list');
            const countEl = getEl('qt-bundles-count');
            if (!list) return;

            if (!currentProject) {
                if (countEl) countEl.textContent = '0';
                list.innerHTML = '<div class="qt-empty">Select a project first</div>';
                return;
            }

            const st = getQuotingState();
            const qEl = getEl('qt-bundle-filter');
            const q = String((qEl && qEl.value) || '').trim().toLowerCase();
            const statusEl = getEl('qt-bundle-status-filter');
            const statusFilter = String((statusEl && statusEl.value) || '').trim();

            const all = getProjectBatches(currentProject);
            const supNorm = (v) => String(v || '').trim().toLowerCase();
            const wantedSup = st.supplier ? supNorm(st.supplier) : '';

            const batches = all.filter(b => {
                if (!b) return false;
                if (wantedSup) {
                    const bn = supNorm(b.supplier_name || b.supplier || '');
                    if (bn !== wantedSup) return false;
                }
                if (statusFilter && String(b.status || 'Draft').trim() !== statusFilter) return false;
                if (q) {
                    const hay = `${b.supplier_name||''} ${b.status||''} ${b.revision||''} ${b.notes||''}`.toLowerCase();
                    if (!hay.includes(q)) return false;
                }
                return true;
            });

            if (countEl) countEl.textContent = String(batches.length);
            renderRFQHistory(batches);
        }

        function bindQuotingCockpitOnce() {
            if (window.__RFQ_QUOTING_COCKPIT_BOUND__) return;
            window.__RFQ_QUOTING_COCKPIT_BOUND__ = true;

            document.addEventListener('input', function(ev){
                const t = ev.target;
                if (!t) return;
                const id = String(t.id || '');
                if (id === 'qt-supplier-filter' || id === 'qt-bundle-filter') {
                    renderQuotingView();
                }
            }, true);
document.addEventListener('change', function(ev){
                const t = ev.target;
                if (!t) return;
                const id = String(t.id || '');
                if (id === 'qt-bundle-status-filter') {
                    renderQuotingView();
                }
            }, true);

            document.addEventListener('click', function(ev){
                const t = ev.target;
                if (!t) return;

                // new bundle
                if (t.id === 'btn-new-rfq-batch') {
                    ev.preventDefault();
                    const now = Date.now();
                    if (window.__rfqWizOpenTs && (now - window.__rfqWizOpenTs) < 250) return;
                    window.__rfqWizOpenTs = now;
                    const st = getQuotingState();
                    st.mode = 'create';
                    st.wizOpen = true;
                    st.batchId = '';
                    renderQuotingView();
                    return;
                }

                // sync
                if (t.id === 'btn-qt-sync') {
                    if (!currentProject) return;
                    try { syncAllBatchesToItems(currentProject); } catch (e) {}
                    try { updateProject(currentProject); } catch (e) {}
                    alert('Synced bundles → items (Suppliers & Pricing).');
                    return;
                }

                // compare
                if (t.id === 'btn-qt-compare') {
                    const st = getQuotingState();
                    st.mode = 'compare';
                    st.batchId = '';
                    renderQuotingView();
                    return;
                }

                // supplier detail
                if (t.id === 'btn-qt-supplier-detail') {
                    const st = getQuotingState();
                    if (!st.supplier) return;
                    // jump to supplier detail view
                    try {
                        switchView('supplier-detail');
                        if (typeof window.openSupplierDetail === 'function') window.openSupplierDetail(st.supplier);
                    } catch (e) {}
                    return;
                }

                                // set winner from compare (tier / all tiers)
                const winTierBtn = t.closest ? t.closest('[data-action="qt-set-winner-tier"]') : null;
                if (winTierBtn) {
                    if (!currentProject) return;
                    const dnEnc = winTierBtn.getAttribute('data-dn') || '';
                    const supEnc = winTierBtn.getAttribute('data-supplier-enc') || '';
                    const tier = parseInt(winTierBtn.getAttribute('data-tier') || '1', 10) || 1;
                    let dn = dnEnc; let sup = supEnc;
                    try { dn = decodeURIComponent(dnEnc); } catch (e) {}
                    try { sup = decodeURIComponent(supEnc); } catch (e) {}
                    setItemWinner(currentProject, dn, sup, { tierIdx: tier });
                    try { updateProject(currentProject); } catch (e) {}
                    renderQuotingCompare();
                    return;
                }

                const winAllBtn = t.closest ? t.closest('[data-action="qt-set-winner-all"]') : null;
                if (winAllBtn) {
                    if (!currentProject) return;
                    const dnEnc = winAllBtn.getAttribute('data-dn') || '';
                    const supEnc = winAllBtn.getAttribute('data-supplier-enc') || '';
                    let dn = dnEnc; let sup = supEnc;
                    try { dn = decodeURIComponent(dnEnc); } catch (e) {}
                    try { sup = decodeURIComponent(supEnc); } catch (e) {}
                    setItemWinner(currentProject, dn, sup, { allTiers: true });
                    try { updateProject(currentProject); } catch (e) {}
                    renderQuotingCompare();
                    return;
                }

                // legacy compare winner button (backward compatible)
                const winBtn = t.closest ? t.closest('[data-action="qt-set-winner"]') : null;
                if (winBtn) {
                    if (!currentProject) return;
                    const dnEnc = winBtn.getAttribute('data-dn') || '';
                    const supEnc = winBtn.getAttribute('data-supplier-enc') || '';
                    let dn = dnEnc; let sup = supEnc;
                    try { dn = decodeURIComponent(dnEnc); } catch (e) {}
                    try { sup = decodeURIComponent(supEnc); } catch (e) {}
                    setItemWinner(currentProject, dn, sup);
                    try { updateProject(currentProject); } catch (e) {}
                    renderQuotingCompare();
                    return;
                }

                // supplier row select
                const supRow = t.closest ? t.closest('[data-action="qt-select-supplier"]') : null;
                if (supRow) {
                    const enc = supRow.getAttribute('data-supplier-enc') || '';
                    let name = '';
                    try { name = decodeURIComponent(enc); } catch (e) { name = enc; }
                    setQuotingSupplier(name);
                    try {
                        // no-op: supplier switching is routed by setQuotingSupplier() + renderQuotingView()
                        // wizard refresh happens only when st.wizOpen === true
                        const st = getQuotingState();
                        if (st && st.wizOpen && st.mode === 'create') { /* handled by renderQuotingView */ }
                    } catch (e) {}
                    return;
                }

                // bundle row open
                const bRow = t.closest ? t.closest('[data-action="qt-open-bundle"]') : null;
                if (bRow) {
                    const id = bRow.getAttribute('data-batch-id') || '';
                    openBundleDetailPage(id, 'quoting');
                    return;
                }
            }, true);
        }

function renderRFQHistory(batchesOverride = null) {
    const container = getEl('quoting-history-list');
    if (!container) return;

    if (!currentProject) {
        container.innerHTML = '<div style="text-align:center; color:#999; padding:20px;">Select a project first</div>';
        return;
    }

    const batches = Array.isArray(batchesOverride) ? batchesOverride : window.RFQData.getRFQBatches(currentProject.id);

    if (batches.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:#999; padding:20px;">No RFQs yet</div>';
        return;
    }

    container.innerHTML = batches.map(batch => {
        const created = batch.created_at || batch.date || '';
        const status = String(batch.status || 'Draft').trim();
        const due = batch.due_date ? new Date(batch.due_date).toLocaleDateString() : '';
        const itemsCount = Array.isArray(batch.items) ? batch.items.length : (Array.isArray(batch.item_ids) ? batch.item_ids.length : 0);

        const st = (typeof getQuotingState === 'function') ? getQuotingState() : { batchId: '' };
        const isActive = String(st.batchId || '') === String(batch.id);

        const badgeClass = (status === 'Quote Received') ? 'ok' : (status === 'Sent' ? 'warn' : 'gray');

        return `
            <div class="qt-bundle-row ${isActive ? 'active' : ''}" data-action="qt-open-bundle" data-batch-id="${batch.id}">
                <div class="qt-row-top">
                    <div class="qt-row-title">${escapeHtml(batch.supplier_name || batch.supplier || 'Supplier')}</div>
                    <span class="qt-badge ${badgeClass}">${escapeHtml(status)}</span>
                </div>
                <div class="qt-row-meta">
                    <span>${created ? new Date(created).toLocaleDateString() : ''}</span>
                    <span>${itemsCount} items${due ? ' • due ' + due : ''}</span>
                    ${batch.revision ? `<span class="qt-badge gray">Rev ${escapeHtml(batch.revision)}</span>` : ``}
                </div>
            </div>
        `;
    }).join('');
}

        
        // Open batch detail in wizard panel (editable)
        function openRFQBatchDetail(batchId) {
            // Prefer full page bundle detail
            try { if (typeof openBundleDetailPage === 'function') { openBundleDetailPage(batchId, 'quoting'); return; } } catch (e) {}
            if (!currentProject) return;
            const panel = getEl('quoting-wizard-panel');
            if (!panel) return;

            const batches = window.RFQData.getRFQBatches(currentProject.id);
            const batch = batches.find(b => String(b.id) === String(batchId));
            if (!batch) {
                panel.innerHTML = '<div style="padding:20px; color:#999;">Batch not found</div>';
                return;
            }

            const statusOptions = ['Draft', 'Sent', 'Quote Received', 'Closed', 'Zrušitled'];
            const currencyOptions = ['EUR','USD','CZK'];
            const incotermsOptions = (window.RFQData.INCOTERMS || ['EXW','FCA','FOB','CIF','DAP','DDP']);

            // Build item index for quick lookup
            const itemByDn = new Map((currentProject.items || []).map(it => [String(it.item_drawing_no || '').trim(), it]));
            const inBatch = new Set((batch.items || []).map(x => String(x.drawing_no || '').trim()));

            // eligible items: items that have this supplier in targets OR items not in batch (allow adding anyway)
            const eligibleItems = (currentProject.items || []).filter(it => {
                const dn = String(it.item_drawing_no || '').trim();
                if (!dn) return false;
                return !inBatch.has(dn);
            });

            panel.innerHTML = `
                <div style="padding: 16px; display:flex; flex-direction:column; gap: 12px; height: 100%;">
                    <div style="display:flex; justify-content:space-between; align-items:center; gap: 10px;">
                        <div style="font-weight:800; font-size:14px;">📦 RFQ Bundle — ${batch.supplier_name || ''}</div>
                        <div style="display:flex; gap: 8px; align-items:center;">
                            <button id="btn-batch-export" class="btn-secondary">Export CSV</button>
                            <button id="btn-batch-delete" class="btn-danger">Delete</button>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div class="form-row">
                            <label>Status</label>
                            <select id="batch-status" class="macos-input">
                                ${statusOptions.map(s => `<option value="${s}" ${s=== (batch.status||'Draft') ? 'selected':''}>${s}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-row">
                            <label>Due date</label>
                            <input id="batch-due" type="date" class="macos-input" value="${(batch.due_date || '').slice(0,10)}">
                        </div>
                        <div class="form-row">
                            <label>Incoterms</label>
                            <select id="batch-incoterms" class="macos-input">
                                ${incotermsOptions.map(s => `<option value="${s}" ${s=== (batch.incoterms||'EXW') ? 'selected':''}>${s}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-row">
                            <label>Currency</label>
                            <select id="batch-currency" class="macos-input">
                                ${currencyOptions.map(c => `<option value="${c}" ${c=== (batch.currency||'EUR') ? 'selected':''}>${c}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-row">
                            <label>Contact name</label>
                            <input id="batch-contact-name" type="text" class="macos-input" value="${batch.contact_person || ''}">
                        </div>
                        <div class="form-row">
                            <label>Contact email</label>
                            <input id="batch-contact-email" type="email" class="macos-input" value="${batch.contact_email || ''}">
                        </div>
                    </div>

                    <div class="form-row">
                        <label>Notes</label>
                        <textarea id="batch-notes" class="macos-input" style="height: 60px; resize: vertical;">${batch.notes || ''}</textarea>
                    </div>

                    <div style="display:flex; gap: 10px; align-items:center;">
                        <select id="batch-add-item" class="macos-input" style="flex: 1;">
                            <option value="">+ Add item to bundle…</option>
                            ${eligibleItems.map(it => {
                                const dn = String(it.item_drawing_no || '').trim();
                                const desc = String(it.description || '').slice(0,60);
                                return `<option value="${dn}">${dn} — ${desc}</option>`;
                            }).join('')}
                        </select>
                        <button id="btn-batch-add-item" class="btn-primary">Add</button>
                        <button id="btn-batch-save" class="btn-success">Uložit</button>
                        <button id="btn-batch-mark-sent" class="btn-primary">Mark Sent</button>
                        <button id="btn-batch-mark-received" class="btn-primary">Mark Quote Received</button>
                        <button id="btn-batch-close" class="btn-secondary">Close</button>
                    </div>

                    <div style="flex: 1; overflow:auto; border: 1px solid #e5e5e5; border-radius: 10px; background: white;">
                        <table class="rfq-table" style="width: 100%;">
                            <thead>
                                <tr>
                                    <th style="width:120px;">Item</th>
                                    <th>Description</th>
                                    <th style="width:170px;">Quantities</th>
                                    <th style="width:220px;">Prices</th>
                                    <th style="width:80px;">Curr</th>
                                    <th style="width:110px;">Lead time</th>
                                    <th style="width:90px;">MOQ</th>
                                    <th style="width:130px;">Valid until</th>
                                    <th style="width:120px;">Quote status</th>
                                    <th style="width:90px;">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(batch.items || []).map(bi => {
                                    const dn = String(bi.drawing_no || '').trim();
                                    const it = itemByDn.get(dn);
                                    const desc = it ? (it.description || '') : '';
                                    const tiers = it ? getItemQtyTiers(it, { includeBlanks: false }) : [];
                                    const qtyHtml = tiers
                                        .map(t => String(t.value ?? '').trim() !== ''
                                            ? `<div class="q-tier"><span class="q-label">Q${t.index}:</span> <span class="q-val">${escapeHtml(String(t.value))}</span></div>`
                                            : '')
                                        .join('') || '<div class="q-muted">—</div>';

                                    // Prices per tier (dynamic): inputs P1..PN follow item qty tiers
                                    const pricesHtml = tiers
                                        .map(t => {
                                            if (String(t.value ?? '').trim() === '') return '';
                                            const k = `price_${t.index}`;
                                            const val = (t.index === 1) ? (bi.price_1 ?? bi.price ?? '') : (bi[k] ?? '');
                                            return `<div class="p-tier"><span class="p-label">P${t.index}:</span><input class="macos-input bi-price bi-price-${t.index}" data-tier-index="${t.index}" type="number" step="0.0001" value="${escapeHtml(String(val))}"></div>`;
                                        })
                                        .join('') || `<div class="p-tier"><input class="macos-input bi-price bi-price-1" data-tier-index="1" type="number" step="0.0001" value="${escapeHtml(String(bi.price ?? ''))}"></div>`;
                                    const qs = bi.quote_status || 'Requested';
                                    return `
                                        <tr data-dn="${dn}">
                                            <td><a href="#" class="link-open-item" data-dn="${dn}">${dn}</a></td>
                                            <td style="font-size:12px;">${escapeHtml(desc)}</td>
                                            <td>${qtyHtml}</td>
                                            <td>${pricesHtml}</td>
                                            <td>
                                                <select class="macos-input bi-currency">
                                                    ${currencyOptions.map(c => `<option value="${c}" ${c=== (bi.currency || batch.currency || 'EUR') ? 'selected':''}>${c}</option>`).join('')}
                                                </select>
                                            </td>
                                            <td><input class="macos-input bi-lead" type="text" placeholder="days" value="${escapeHtml(String(bi.lead_time_days ?? ''))}"></td>
                                            <td><input class="macos-input bi-moq" type="text" value="${escapeHtml(String(bi.moq ?? ''))}"></td>
                                            <td><input class="macos-input bi-valid" type="date" value="${escapeHtml(String(bi.valid_until || '').slice(0,10))}"></td>
                                            <td>
                                                <select class="macos-input bi-qstatus">
                                                    ${['Requested','Quoted','No Bid'].map(s => `<option value="${s}" ${s=== qs ? 'selected':''}>${s}</option>`).join('')}
                                                </select>
                                            </td>
                                            <td style="display:flex; gap:6px;">
                                                <button class="btn-secondary btn-mini btn-remove-bi">Remove</button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            try { panel.dataset.activeBatchId = String(batch.id); } catch (e) {}

            // events
            const saveCurrent = () => {
                const updated = { ...batch };
                updated.status = panel.querySelector('#batch-status').value;
                updated.due_date = panel.querySelector('#batch-due').value || '';
                updated.incoterms = panel.querySelector('#batch-incoterms').value;
                updated.currency = panel.querySelector('#batch-currency').value;
                updated.contact_person = panel.querySelector('#batch-contact-name').value;
                updated.contact_email = panel.querySelector('#batch-contact-email').value;
                updated.notes = panel.querySelector('#batch-notes').value;

                // items
                updated.items = (updated.items || []).map(bi => ({ ...bi }));
                panel.querySelectorAll('tbody tr[data-dn]').forEach(tr => {
                    const dn = tr.dataset.dn;
                    const bi = updated.items.find(x => String(x.drawing_no) === String(dn));
                    if (!bi) return;
                    {
                        // Collect all tier prices from inputs (dynamic)
                        const inputs = tr.querySelectorAll('.bi-price[data-tier-index]');
                        inputs.forEach(inp => {
                            const idx = Number(inp.dataset.tierIndex);
                            if (!Number.isFinite(idx) || idx <= 0) return;
                            const val = inp.value ?? '';
                            bi[`price_${idx}`] = val;
                            if (idx === 1) {
                                bi.price_1 = val;
                                bi.price = val; // legacy alias
                            }
                        });

                        // Backward compatibility for older bundles (ensure at least price_1 exists)
                        if (bi.price_1 === undefined && bi.price !== undefined) bi.price_1 = bi.price;
                        if (bi.price === undefined && bi.price_1 !== undefined) bi.price = bi.price_1;
                    }
                    bi.currency = tr.querySelector('.bi-currency').value;
                    bi.lead_time_days = tr.querySelector('.bi-lead').value;
                    bi.moq = tr.querySelector('.bi-moq').value;
                    bi.valid_until = tr.querySelector('.bi-valid').value;
                    bi.quote_status = tr.querySelector('.bi-qstatus').value;
                });

                window.RFQData.saveRFQBatch(currentProject.id, updated);
                // keep currentProject in sync without overwriting unsaved item edits
                syncProjectBatchesIntoMemory(currentProject);
                // propagate edits into item suppliers & pricing (best-effort)
                try { applyBatchToItems(currentProject, updated, 'save'); } catch (e) { console.error('applyBatchToItems(save) failed', e); }
                try { updateProject(currentProject); } catch (e) { console.error('updateProject failed', e); }
renderRFQHistory();
                return updated;
            };

            panel.querySelector('#btn-batch-save').addEventListener('click', () => {
                saveCurrent();
                alert('Uložitd');
            });

            panel.querySelector('#btn-batch-add-item').addEventListener('click', () => {
                const dn = panel.querySelector('#batch-add-item').value;
                if (!dn) return;
                const updated = { ...batch, items: [...(batch.items || [])] };
                if (updated.items.some(x => String(x.drawing_no) === String(dn))) return;

                updated.items.push({
                    drawing_no: dn,
                    quote_status: 'Requested',
                    price: '',
                    price_1: '',
                    price_2: '',
                    price_3: '',
                    price_4: '',
                    price_5: '',
                    currency: (batch.currency || 'EUR'),
                    lead_time_days: '',
                    moq: '',
                    valid_until: ''
                });

                // Ensure supplier record exists on the item
                const it = itemByDn.get(String(dn));
                if (it) {
                    if (!Array.isArray(it.suppliers)) it.suppliers = [];
                    let sup = it.suppliers.find(s => s && s.name === (batch.supplier_name || ''));
                    if (!sup) {
                        it.suppliers.push({ id: Date.now(), name: batch.supplier_name, status: 'Planned', currency: batch.currency || 'EUR', isMain: false, price: 0, price_1: 0 });
                    }
                }

                window.RFQData.saveRFQBatch(currentProject.id, updated);
                syncProjectBatchesIntoMemory(currentProject);
                try { applyBatchToItems(currentProject, updated, 'save'); } catch (e) { console.error('applyBatchToItems(save) failed', e); }
                try { updateProject(currentProject); } catch (e) { console.error('updateProject failed', e); }
                openRFQBatchDetail(updated.id);
                renderRFQHistory();
            });

            panel.querySelector('#btn-batch-mark-sent').addEventListener('click', () => {
                const updated = saveCurrent();
                updated.status = 'Sent';
                updated.sent_at = new Date().toISOString();

                // update item supplier statuses
                (updated.items || []).forEach(bi => {
                    const it = itemByDn.get(String(bi.drawing_no));
                    if (!it) return;
                    if (!Array.isArray(it.suppliers)) it.suppliers = [];
                    const sup = it.suppliers.find(s => s && s.name === updated.supplier_name);
                    if (sup) sup.status = 'RFQ Sent';
                    if (it.status === 'New') it.status = 'RFQ Sent';
                });

                window.RFQData.saveRFQBatch(currentProject.id, updated);
                syncProjectBatchesIntoMemory(currentProject);
                try { applyBatchToItems(currentProject, updated, 'sent'); } catch (e) { console.error('applyBatchToItems(sent) failed', e); }
                try { updateProject(currentProject); } catch (e) { console.error('updateProject failed', e); }
                alert('Marked as Sent');
                openRFQBatchDetail(updated.id);
                renderRFQHistory();
            });

            panel.querySelector('#btn-batch-mark-received').addEventListener('click', () => {
                const updated = saveCurrent();
                updated.status = 'Quote Received';
                updated.quote_received_at = new Date().toISOString();

                (updated.items || []).forEach(bi => {
                    const it = itemByDn.get(String(bi.drawing_no));
                    if (!it) return;
                    if (!Array.isArray(it.suppliers)) it.suppliers = [];
                    const sup = it.suppliers.find(s => s && s.name === updated.supplier_name);
                    if (sup) {
                        sup.status = (bi.quote_status === 'No Bid') ? 'No Bid' : 'Quote Received';
                        if (bi.price !== '') {
                            const num = parseFloat(bi.price);
                            if (!isNaN(num)) {
                                sup.price = num;
                                sup.price_1 = num;
                            }
                        }
                        sup.currency = bi.currency || updated.currency;
                        sup.lead_time_days = bi.lead_time_days;
                        sup.moq = bi.moq;
                        sup.valid_until = bi.valid_until;
                        sup.last_quote_date = new Date().toISOString().slice(0,10);

                        if (sup.isMain) {
                            it.supplier = sup.name;
                            it.price_1 = sup.price_1 || sup.price || it.price_1;
                            it.currency = sup.currency || it.currency;
                            calculateEuroValues(it);
                        }
                    }
                    if (it.status === 'RFQ Sent') it.status = 'Quote Received';
                });

                window.RFQData.saveRFQBatch(currentProject.id, updated);
                syncProjectBatchesIntoMemory(currentProject);
                try { applyBatchToItems(currentProject, updated, 'received'); } catch (e) { console.error('applyBatchToItems(received) failed', e); }
                try { updateProject(currentProject); } catch (e) { console.error('updateProject failed', e); }
                alert('Quote received saved to items');
                openRFQBatchDetail(updated.id);
                renderRFQHistory();
            });

            panel.querySelector('#btn-batch-close').addEventListener('click', () => {
                const updated = saveCurrent();
                updated.status = 'Closed';
                window.RFQData.saveRFQBatch(currentProject.id, updated);
                alert('Closed');
                renderRFQHistory();
                openRFQBatchDetail(updated.id);
            });

            panel.querySelector('#btn-batch-delete').addEventListener('click', () => {
                if (!confirm('Delete this RFQ bundle?')) return;
                window.RFQData.deleteRFQBatch(currentProject.id, batch.id);
                resetRFQWizard();
                renderRFQHistory();
            });

            panel.querySelector('#btn-batch-export').addEventListener('click', () => {
                const updated = saveCurrent();
                exportBatchCSV(updated);
            });

            // row events
            panel.querySelectorAll('.btn-remove-bi').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tr = e.target.closest('tr[data-dn]');
                    if (!tr) return;
                    const dn = tr.dataset.dn;
                    const updated = { ...batch, items: (batch.items || []).filter(x => String(x.drawing_no) !== String(dn)) };
                    window.RFQData.saveRFQBatch(currentProject.id, updated);
                    openRFQBatchDetail(updated.id);
                    renderRFQHistory();
                });
            });

            panel.querySelectorAll('.link-open-item').forEach(a => {
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    const dn = e.target.dataset.dn;
                    // navigate to item detail
                    switchView('items');
                    openItemDetail((currentProject.items || []).findIndex(x => String(x.item_drawing_no) === String(dn)));
                });
            });
        }

        function exportBatchCSV(batch) {
            if (!currentProject) return;
            const itemByDn = new Map((currentProject.items || []).map(it => [String(it.item_drawing_no || '').trim(), it]));
            // Determine max qty tiers across items in this bundle (cap at 10 for CSV readability)
            let maxTier = 5;
            (batch.items || []).forEach(bi => {
                const it = itemByDn.get(String(bi.drawing_no || '').trim());
                const m = getMaxQtyIndex(it || {}, 5);
                if (m > maxTier) maxTier = m;
            });
            if (maxTier > 10) maxTier = 10;

            const rows = [
                ['Project', currentProject.name],
                ['Supplier', batch.supplier_name || ''],
                ['Status', batch.status || ''],
                ['Due date', batch.due_date || ''],
                ['Incoterms', batch.incoterms || ''],
                ['Currency', batch.currency || ''],
                ['Contact', batch.contact_person || ''],
                ['Email', batch.contact_email || ''],
                [],
                ['Item/Drawing No', 'Description', ...Array.from({length: maxTier}, (_,i) => `Qty${i+1}`), ...Array.from({length: maxTier}, (_,i) => `Price${i+1}`), 'Currency', 'Lead time (days)', 'MOQ', 'Valid until', 'Quote status']
            ];
            (batch.items || []).forEach(bi => {
    const it = itemByDn.get(String(bi.drawing_no || '').trim());
    const qtyCols = Array.from({length: maxTier}, (_, i) => (it ? (it[`qty_${i+1}`] || '') : ''));
    const priceCols = Array.from({length: maxTier}, (_, i) => {
        const idx = i + 1;
        const k = `price_${idx}`;
        if (idx === 1) return (bi.price_1 ?? bi.price ?? '');
        return (bi[k] ?? '');
    });
    rows.push([
        bi.drawing_no || '',
        (it ? (it.description || '') : ''),
        ...qtyCols,
        ...priceCols,
        (bi.currency || batch.currency || 'EUR'),
        (bi.lead_time_days ?? ''),
        (bi.moq ?? ''),
        (bi.valid_until ?? ''),
        (bi.quote_status || 'Requested')
    ]);
});

            const csv = rows.map(r => r.map(v => {
                const s = String(v ?? '');
                return /[\",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
            }).join(',')).join('\n');

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `RFQ_Bundle_${(batch.supplier_name || 'supplier').replace(/\s+/g,'_')}_${new Date().toISOString().slice(0,10)}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function escapeHtml(str) {
            return String(str ?? '').replace(/[&<>"']/g, (m) => ({
                '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
            }[m]));
        }


function escapeAttr(str) {
            return escapeHtml(str);
        }

        // Safe helper for <input type="number"> value attributes
        // - prevents console errors / DOMExceptions when legacy data contains non-numeric strings (e.g. 'EXW')
        function toNumberInputValue(v) {
            const s = String(v ?? '').trim();
            if (!s) return '';
            // accept "12,34" as "12.34"
            const norm = s.replace(',', '.');
            const n = parseFloat(norm);
            if (!Number.isFinite(n)) return '';
            return String(n);
        }



        // ---------------------------------------------------------
        // Quoting: robust delegated handlers + save-from-DOM fallback
        // (prevents "click does nothing" even if per-render listeners fail)
        // ---------------------------------------------------------
        function _getQuotingPanel() {
            return getEl('quoting-wizard-panel');
        }

        function _getActiveBatchIdFromPanel() {
            const panel = _getQuotingPanel();
            const id = panel && panel.dataset ? panel.dataset.activeBatchId : '';
            return String(id || '').trim();
        }

        function _getBatchById(batchId) {
            if (!currentProject) return null;
            const batches = (window.RFQData && typeof window.RFQData.getRFQBatches === 'function')
                ? window.RFQData.getRFQBatches(currentProject.id)
                : [];
            return (batches || []).find(b => String(b.id) === String(batchId)) || null;
        }

        function saveActiveRFQBatchFromPanel() {
            if (!currentProject) { try { alert('Select a project first'); } catch (e) {} return null; }
            const panel = _getQuotingPanel();
            if (!panel) return null;

            const batchId = _getActiveBatchIdFromPanel();
            if (!batchId) return null;

            const batch = _getBatchById(batchId);
            if (!batch) return null;

            const updated = { ...batch };

            // header fields
            const q = (sel) => panel.querySelector(sel);
            if (q('#batch-status')) updated.status = q('#batch-status').value;
            if (q('#batch-due')) updated.due_date = q('#batch-due').value;
            if (q('#batch-incoterms')) updated.incoterms = q('#batch-incoterms').value;
            if (q('#batch-currency')) updated.currency = q('#batch-currency').value;
            if (q('#batch-contact-name')) updated.contact_person = q('#batch-contact-name').value;
            if (q('#batch-contact-email')) updated.contact_email = q('#batch-contact-email').value;
            if (q('#batch-notes')) updated.notes = q('#batch-notes').value;

            // items
            updated.items = (updated.items || []).map(bi => ({ ...bi }));

            panel.querySelectorAll('tbody tr[data-dn]').forEach(tr => {
                const dn = String(tr.dataset.dn || '').trim();
                if (!dn) return;
                const bi = (updated.items || []).find(x => String(x.drawing_no || '').trim() === dn);
                if (!bi) return;

                // prices (dynamic tiers)
                tr.querySelectorAll('.bi-price[data-tier-index]').forEach(inp => {
                    const idx = Number(inp.dataset.tierIndex);
                    if (!Number.isFinite(idx) || idx <= 0) return;
                    const val = inp.value ?? '';
                    bi[`price_${idx}`] = val;
                    if (idx === 1) {
                        bi.price_1 = val;
                        bi.price = val; // legacy alias
                    }
                });
                if (bi.price_1 === undefined && bi.price !== undefined) bi.price_1 = bi.price;
                if (bi.price === undefined && bi.price_1 !== undefined) bi.price = bi.price_1;

                const cur = tr.querySelector('.bi-currency');
                const lead = tr.querySelector('.bi-lead');
                const moq = tr.querySelector('.bi-moq');
                const valid = tr.querySelector('.bi-valid');
                const qs = tr.querySelector('.bi-qstatus');
                if (cur) bi.currency = cur.value;
                if (lead) bi.lead_time_days = lead.value;
                if (moq) bi.moq = moq.value;
                if (valid) bi.valid_until = valid.value;
                if (qs) bi.quote_status = qs.value;
            });

            // persist
            try { window.RFQData.saveRFQBatch(currentProject.id, updated); } catch (e) { console.error('saveRFQBatch failed', e); }
            try { syncProjectBatchesIntoMemory(currentProject); } catch (e) { console.error('syncProjectBatchesIntoMemory failed', e); }
            try { applyBatchToItems(currentProject, updated, 'save'); } catch (e) { console.error('applyBatchToItems(save) failed', e); }
            try { updateProject(currentProject); } catch (e) { console.error('updateProject failed', e); }
            try { renderRFQHistory(); } catch (e) { console.error('renderRFQHistory failed', e); }

            return updated;
        }

        function _withUložitdBatch(fn) {
            const b = saveActiveRFQBatchFromPanel();
            if (!b) return null;
            try { fn && fn(b); } catch (e) { console.error(e); }
            try { window.RFQData.saveRFQBatch(currentProject.id, b); } catch (e) { console.error('saveRFQBatch failed', e); }
            try { syncProjectBatchesIntoMemory(currentProject); } catch (e) {}
            try { applyBatchToItems(currentProject, b, 'save'); } catch (e) {}
            try { updateProject(currentProject); } catch (e) {}
            try { openRFQBatchDetail(b.id); } catch (e) {}
            try { renderRFQHistory(); } catch (e) {}
            return b;
        }

        function bindQuotingDelegationOnce() {
            if (window.__rfqQuotingDelegationBound) return;
            window.__rfqQuotingDelegationBound = true;

            document.addEventListener('click', (ev) => {
                const target = ev.target && ev.target.closest ? ev.target.closest('button, a, .rfq-history-card') : null;
                if (!target) return;

                // Open RFQ batch from history list (fallback)
                if (target.classList && target.classList.contains('rfq-history-card')) {
                    const id = target.dataset ? target.dataset.batchId : '';
                    if (id) { ev.preventDefault(); try { openRFQBatchDetail(id); } catch (e) { console.error(e); } }
                    return;
                }

                // Open item detail from batch table link
                if (target.classList && target.classList.contains('link-open-item')) {
                    ev.preventDefault();
                    const dn = target.dataset ? target.dataset.dn : '';
                    const idx = (currentProject && currentProject.items) ? (currentProject.items || []).findIndex(x => String(x.item_drawing_no || '').trim() === String(dn || '').trim()) : -1;
                    if (idx >= 0 && typeof openItemDetail === 'function') openItemDetail(idx);
                    return;
                }

                const id = target.id || '';

                if (id === 'btn-new-rfq-batch') {
                    ev.preventDefault();
                    try {
                        const st = (typeof getQuotingState === 'function') ? getQuotingState() : { supplier: '' };
                        let sup = String(st && st.supplier ? st.supplier : '').trim();

                        // Fallback: active supplier row in left panel
                        if (!sup) {
                            try {
                                const row = document.querySelector('#quoting-suppliers-list .qt-supplier-row.active[data-supplier-enc]');
                                if (row) {
                                    const enc = row.getAttribute('data-supplier-enc') || '';
                                    try { sup = decodeURIComponent(enc); } catch (e) { sup = enc; }
                                    sup = String(sup || '').trim();
                                }
                            } catch (e) {}
                        }

                        try {
                            if (st) {
                                st.mode = 'create';
                                st.batchId = '';
                                if (sup) st.supplier = sup;
                            }
                        } catch (e) {}

                        startRFQWizard(sup || null, []);
                    } catch (e) { console.error(e); }
                    return;
                }

                if (id === 'btn-batch-save') {
                    ev.preventDefault();
                    const b = saveActiveRFQBatchFromPanel();
                    if (b) { try { alert('Uložitd'); } catch (e) {} }
                    return;
                }

                if (id === 'btn-batch-mark-sent') {
                    ev.preventDefault();
                    _withUložitdBatch((b) => {
                        b.status = 'Sent';
                        b.sent_at = new Date().toISOString();
                        // update supplier statuses on items
                        const itemByDn = new Map((currentProject.items || []).map(it => [String(it.item_drawing_no || '').trim(), it]));
                        (b.items || []).forEach(bi => {
                            const it = itemByDn.get(String(bi.drawing_no || '').trim());
                            if (!it) return;
                            if (!Array.isArray(it.suppliers)) it.suppliers = [];
                            const sup = (it.suppliers || []).find(s => s && String(s.name || '').trim() === String(b.supplier_name || '').trim());
                            if (sup) sup.status = 'RFQ Sent';
                            if (it.status === 'New') it.status = 'RFQ Sent';
                        });
                    });
                    try { alert('Marked as Sent'); } catch (e) {}
                    return;
                }

                if (id === 'btn-batch-mark-received') {
                    ev.preventDefault();
                    _withUložitdBatch((b) => {
                        b.status = 'Quote Received';
                        b.quote_received_at = new Date().toISOString();
                    });
                    try { alert('Marked as Quote Received'); } catch (e) {}
                    return;
                }

                if (id === 'btn-batch-close') {
                    ev.preventDefault();
                    try { resetRFQWizard(); } catch (e) { console.error(e); }
                    return;
                }

                if (id === 'btn-batch-export') {
                    ev.preventDefault();
                    const batchId = _getActiveBatchIdFromPanel();
                    const b = batchId ? _getBatchById(batchId) : null;
                    if (b && typeof exportBatchCSV === 'function') {
                        try { exportBatchCSV(b); } catch (e) { console.error(e); }
                    }
                    return;
                }

                if (id === 'btn-batch-delete') {
                    ev.preventDefault();
                    const batchId = _getActiveBatchIdFromPanel();
                    if (!batchId) return;
                    let ok = true;
                    try { ok = confirm('Delete this RFQ bundle?'); } catch (e) {}
                    if (!ok) return;
                    try { window.RFQData.deleteRFQBatch(currentProject.id, batchId); } catch (e) { console.error(e); }
                    try { syncProjectBatchesIntoMemory(currentProject); } catch (e) {}
                    try { updateProject(currentProject); } catch (e) {}
                    try { resetRFQWizard(); } catch (e) {}
                    try { renderRFQHistory(); } catch (e) {}
                    return;
                }

                // Remove line item in batch table
                if (target.classList && target.classList.contains('btn-remove-bi')) {
                    ev.preventDefault();
                    const tr = target.closest('tr[data-dn]');
                    const dn = tr ? String(tr.dataset.dn || '').trim() : '';
                    const batchId = _getActiveBatchIdFromPanel();
                    const batch = batchId ? _getBatchById(batchId) : null;
                    if (!dn || !batch) return;
                    const updated = { ...batch, items: (batch.items || []).filter(x => String(x.drawing_no || '').trim() !== dn) };
                    try { window.RFQData.saveRFQBatch(currentProject.id, updated); } catch (e) { console.error(e); }
                    try { syncProjectBatchesIntoMemory(currentProject); } catch (e) {}
                    try { applyBatchToItems(currentProject, updated, 'save'); } catch (e) {}
                    try { updateProject(currentProject); } catch (e) {}
                    try { openRFQBatchDetail(updated.id); } catch (e) {}
                    try { renderRFQHistory(); } catch (e) {}
                    return;
                }
            }, true);
        }
        bindQuotingDelegationOnce();

function resetRFQWizard() {
            // reset quoting wizard state (non-destructive)
            try {
                const st = getQuotingState();
                st.wizOpen = false;
                if (st.mode === 'create') st.mode = st.supplier ? 'supplier' : 'home';
                st.batchId = '';
            } catch (e) {}

            // route back to workspace home
            try { renderQuotingView(); } catch (e) {
                const panel = getEl('quoting-wizard-panel');
                if (panel) {
                    panel.innerHTML = `
                        <div style="padding: 40px; text-align: center; color: #888; margin-top: auto; margin-bottom: auto;">
                            <div style="font-size: 48px; margin-bottom: 16px;">📋</div>
                            <div>Select "New RFQ Bundle" to start a quoting process</div>
                        </div>
                    `;
                }
            }
        }

        // Listener for New RFQ Bundle button (needs to be added once)
        const btnNewBatch = getEl('btn-new-rfq-batch');
        if (btnNewBatch) btnNewBatch.onclick = () => {
            const st = getQuotingState();
            st.mode = 'create';
            st.wizOpen = true;
            st.batchId = '';
            renderQuotingView();
        };

        
        function startRFQWizard(preselectedSupplierName = null, preselectedItemDNs = []) {
            if (!currentProject) { alert('Select a project first'); return; }

            const panel = getEl('quoting-wizard-panel');
            if (!panel) return;

            
            
            try { ensureProjectSupplierLinks(currentProject); } catch (e) {}
// Auto-pick supplier from Quoting Cockpit if not provided
            try {
                if (!preselectedSupplierName && typeof getQuotingState === 'function') {
                    const st = getQuotingState();
                    const s = st && st.supplier ? String(st.supplier).trim() : '';
                    if (s) preselectedSupplierName = s;
                }
            } catch (e) {}

            // Fallback: active supplier row (when state is not set)
            try {
                if (!preselectedSupplierName) {
                    const row = document.querySelector('#quoting-suppliers-list .qt-supplier-row.active[data-supplier-enc]');
                    if (row) {
                        const enc = row.getAttribute('data-supplier-enc') || '';
                        let s = enc;
                        try { s = decodeURIComponent(enc); } catch (e) {}
                        s = String(s || '').trim();
                        if (s) preselectedSupplierName = s;
                    }
                }
            } catch (e) {}

const today = new Date();
            const isoToday = today.toISOString().slice(0, 10);
            const dueDefault = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

            // Build supplier candidates from targets + history
            const supplierSet = new Set(deriveAllSupplierNamesForProject(currentProject));
(currentProject.items || []).forEach(it => (it.suppliers || []).forEach(s => {
    const n = resolveSupplierName(currentProject, s);
    if (n) supplierSet.add(n);
}));
(window.RFQData.getRFQBatches(currentProject.id) || []).forEach(b => {
    const n = String(b && (b.supplier_name || b.supplier) || '').trim();
    if (n) supplierSet.add(n);
});

// Planned suppliers first (so user sees targets on top)
const plannedSet = new Set();
(currentProject.items || []).forEach(it => (it.suppliers || []).forEach(s => {
    const status = String(s && (s.status || s.target_status || '') || '').trim().toLowerCase();
    const n = resolveSupplierName(currentProject, s);
    if (n && status === 'planned') plannedSet.add(n);
}));

const planned = Array.from(plannedSet).sort((a, b) => a.localeCompare(b));
            const others = Array.from(supplierSet).filter(x => !plannedSet.has(x)).sort((a, b) => a.localeCompare(b));
            const supplierOptions = [...planned, ...others];

            const dnSet = new Set((preselectedItemDNs || []).map(x => String(x || '').trim()).filter(Boolean));

            
            // Wizard selection state must survive re-renders (filtering / show-all toggles).
            // Using a Set avoids relying on DOM querySelectorAll(':checked'), which can be fragile after re-render.
            window.__RFQ_WIZ_SELECTED = window.__RFQ_WIZ_SELECTED || new Set();
            window.__RFQ_WIZ_SELECTED.clear();
            Array.from(dnSet).forEach(x => { if (x) window.__RFQ_WIZ_SELECTED.add(String(x).trim()); });
            const selectedDNsState = window.__RFQ_WIZ_SELECTED;
            let lastSupplierName = null;
            let seededPlanned = false;
panel.innerHTML = `
                <div style="padding: 20px; display: flex; flex-direction: column; height: 100%; min-height: 0;">
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom: 14px;">
                        <h3 style="margin:0;">Create RFQ Bundle</h3>
                        <div style="font-size: 11px; color:#888;">Project: <b>${escapeHtml(currentProject.name || '')}</b></div>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                        <div class="form-row">
                            <label>Supplier (targets & history)</label>
                            <select id="rfq-wiz-supplier" class="macos-input">
                                <option value="">-- Select supplier --</option>
                                ${supplierOptions.map(s => `<option value="${escapeHtml(s)}" ${preselectedSupplierName===s ? 'selected' : ''}>${escapeHtml(plannedSet.has(s) ? '⭐ ' + s : s)}</option>`).join('')}
                            </select>
                            <div style="font-size: 11px; color:#888; margin-top: 4px;">⭐ = has Planned targets in this project</div>
                        </div>

                        <div class="form-row">
                            <label>Or type supplier</label>
                            <input id="rfq-wiz-supplier-manual" type="text" class="macos-input" placeholder="e.g. Bosch, Würth..." value="${escapeHtml(preselectedSupplierName || '')}">
                            <div style="font-size: 11px; color:#888; margin-top: 4px;">Use this when supplier is not in the list yet.</div>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                        <div class="form-row">
                            <label>Due date</label>
                            <input id="rfq-wiz-due" type="date" class="macos-input" value="${dueDefault}">
                        </div>
                        <div class="form-row">
                            <label>Incoterms</label>
                            <select id="rfq-wiz-incoterms" class="macos-input">
                                ${(window.RFQData.INCOTERMS || ['EXW','FCA','FOB','CIF','DAP','DDP']).map(s => `<option value="${s}" ${s==='EXW' ? 'selected' : ''}>${s}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-row">
                            <label>Currency</label>
                            <select id="rfq-wiz-currency" class="macos-input">
                                ${((window.RFQData && Array.isArray(window.RFQData.CURRENCIES) && window.RFQData.CURRENCIES.length) ? window.RFQData.CURRENCIES : ['EUR','USD','CZK']).slice(0, 20).map(c => `<option value="${c}" ${c==='EUR' ? 'selected' : ''}>${c}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-row">
                            <label>Revision</label>
                            <input id="rfq-wiz-rev" type="text" class="macos-input" value="A">
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                        <div class="form-row">
                            <label>Contact name</label>
                            <input id="rfq-wiz-contact" type="text" class="macos-input" placeholder="Name">
                        </div>
                        <div class="form-row">
                            <label>Contact email</label>
                            <input id="rfq-wiz-email" type="email" class="macos-input" placeholder="Email">
                        </div>
                    </div>

                    <div class="form-row" style="margin-bottom: 10px;">
                        <label>Notes (optional)</label>
                        <textarea id="rfq-wiz-notes" class="macos-input" style="height: 54px; resize: vertical;" placeholder="Anything the supplier should know…"></textarea>
                    </div>

                    <div style="display:flex; gap: 10px; align-items:center; margin-bottom: 10px;">
                        <input id="rfq-wiz-filter" type="text" class="macos-input" placeholder="Filter items (drawing no / description / mpn / manufacturer)" style="flex: 1;">
                        <label style="font-size:12px; color:#555; display:flex; align-items:center; gap:8px; white-space:nowrap;">
                            <input id="rfq-wiz-show-all" type="checkbox">
                            Show all items
                        </label>
                    </div>
                    <div class="qt-split" style="flex: 1; min-height: 0;">
                        <div id="rfq-wiz-items" style="border: 1px solid #eee; border-radius: 10px; overflow: auto; background: white; min-height: 0;">
                            <div style="text-align:center; color:#999; padding: 40px 12px;">Select a supplier (or type one) to load items</div>
                        </div>

                        <div class="qt-selected-box" style="min-height: 0; overflow: auto;">
                            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
                                <div style="font-weight:800; color:#333;">Selected Items</div>
                                <span id="rfq-wiz-selected-count" class="qt-pill">0</span>
                            </div>
                            <div style="font-size:11px; color:#666; margin-top: 6px;">
                                Tip: click a row to select. Remove an item by clicking ✕ on a chip.
                            </div>
                            <div id="rfq-wiz-selected" class="qt-selected-chips"></div>
                        </div>
                    </div>


                    <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-top: 12px;">
                        <div id="rfq-wiz-summary" style="font-size:12px; color:#666;">0 items selected</div>
                        <div style="display:flex; gap:10px;">
                            <button id="rfq-wiz-cancel" class="btn-secondary">Zrušit</button>
                            <button id="rfq-wiz-create-draft" class="btn-success rfq-disabled" data-rfq-action="wiz-create-draft" data-disabled="1">Create Draft Bundle</button>
                            <button id="rfq-wiz-create-sent" class="btn-primary rfq-disabled" data-rfq-action="wiz-create-sent" data-disabled="1">Create + Mark Sent + Export</button>
                        </div>
                    </div>
                </div>
            `;

            const elSel = panel.querySelector('#rfq-wiz-supplier');
            const elManual = panel.querySelector('#rfq-wiz-supplier-manual');
            
            // Normalize preselected supplier into controls (case-insensitive match)
            try {
                const norm = (v) => String(v || '').trim().toLowerCase();
                const pre = String(preselectedSupplierName || '').trim();
                if (pre) {
                    if (elManual && !String(elManual.value || '').trim()) elManual.value = pre;
                    if (elSel) {
                        const cur = String(elSel.value || '').trim();
                        if (!cur || norm(cur) !== norm(pre)) {
                            const opt = Array.from(elSel.options || []).find(o => norm(o && o.value) === norm(pre));
                            if (opt) elSel.value = opt.value;
                        }
                    }
                }
            } catch (e) {}
const elFilter = panel.querySelector('#rfq-wiz-filter');
            const elShowAll = panel.querySelector('#rfq-wiz-show-all');
            const elItems = panel.querySelector('#rfq-wiz-items');
            const elSummary = panel.querySelector('#rfq-wiz-summary');
            const elSelectedCount = panel.querySelector('#rfq-wiz-selected-count');
            const elSelected = panel.querySelector('#rfq-wiz-selected');
            const btnDraft = panel.querySelector('#rfq-wiz-create-draft');
            const btnSent = panel.querySelector('#rfq-wiz-create-sent');

            // Supplier name helper (must be hoisted - used by window.__RFQ_WIZ_UPDATE_UI)
            function getSupplierName() {
                try {
                    const mEl = elManual || (panel && panel.querySelector ? panel.querySelector('#rfq-wiz-supplier-manual') : null) || document.getElementById('rfq-wiz-supplier-manual');
                    const sEl = elSel || (panel && panel.querySelector ? panel.querySelector('#rfq-wiz-supplier') : null) || document.getElementById('rfq-wiz-supplier');
                    const manual = String((mEl && mEl.value) || '').trim();
                    const sel = String((sEl && sEl.value) || '').trim();
                    return manual || sel;
                } catch (e) {
                    return '';
                }
            }

            // Supplier match helper (prevents wizard breakage if supplierRecMatches is missing)
            function supplierRecMatchesSafe(project, rec, supplierName) {
                try {
                    if (typeof supplierRecMatches === 'function') {
                        return !!supplierRecMatches(project, rec, supplierName);
                    }
                } catch (e) {}
                const norm = (v) => String(v || '').trim().toLowerCase();
                const target = norm(supplierName);
                if (!target || !rec) return false;
                const name = rec.name || rec.supplier_name || rec.supplier || rec.supplier_id || '';
                return norm(name) === target;
            }

            // Robust Wizard UI updater (does not rely on inner closures; survives re-renders)
            window.__RFQ_WIZ_UPDATE_UI = function() {
                try {
                    const selSet = window.__RFQ_WIZ_SELECTED || selectedDNsState || new Set();
                    const count = selSet.size;

                    if (elSummary) elSummary.textContent = `${count} item(s) selected`;
                    if (elSelectedCount) elSelectedCount.textContent = String(count);

                    // Chips
                    if (elSelected) {
                        const arr = Array.from(selSet).map(x => String(x || '').trim()).filter(Boolean).sort((a,b)=>a.localeCompare(b));
                        if (arr.length === 0) {
                            elSelected.innerHTML = '<div class="qt-empty" style="padding:14px 0;">No items selected</div>';
                        } else {
                            elSelected.innerHTML = arr.map(dn => {
                                const enc = encodeURIComponent(dn);
                                return `<span class="qt-chip">${escapeHtml(dn)} <button type="button" data-action="rfq-wiz-remove" data-dn-enc="${enc}" title="Remove">✕</button></span>`;
                            }).join('');
                        }
                    }

                    // Sync visible checkboxes + row highlight to Set
                    try {
                        const root = panel.querySelector('#rfq-wiz-items');
                        if (root) {
                            root.querySelectorAll('input[type="checkbox"][data-dn-enc]').forEach(cb => {
                                const enc = cb.getAttribute('data-dn-enc') || '';
                                let dn = '';
                                try { dn = decodeURIComponent(enc); } catch(e) { dn = enc; }
                                dn = String(dn || '').trim();
                                const should = !!dn && selSet.has(dn);
                                cb.checked = should;
                                const tr = cb.closest ? cb.closest('tr') : null;
                                if (tr) tr.classList.toggle('rfq-wiz-selected', should);
                            });
                        }
                    } catch(e) {}

                    const supplierOk = !!getSupplierName();
                    setRFQWizardBtnState(btnDraft, !(count > 0 && supplierOk));
                    setRFQWizardBtnState(btnSent, !(count > 0 && supplierOk));
                } catch (e) {
                    console.error('RFQ wizard update UI failed', e);
                }
            };


            const setRFQWizardBtnState = (btn, disabled) => {
                if (!btn) return;
                if (disabled) {
                    btn.dataset.disabled = '1';
                    btn.classList.add('rfq-disabled');
                    btn.setAttribute('aria-disabled', 'true');
                } else {
                    btn.dataset.disabled = '0';
                    btn.classList.remove('rfq-disabled');
                    btn.removeAttribute('aria-disabled');
                }
            };


            panel.querySelector('#rfq-wiz-cancel').onclick = resetRFQWizard;
            // Remove chip handler (updates Set + checkbox)
            if (!panel.__rfqWizChipBound) {
                panel.__rfqWizChipBound = true;
                panel.addEventListener('click', function(ev){
                const t = ev.target;
                if (!t) return;
                const act = t.getAttribute && t.getAttribute('data-action');
                if (act !== 'rfq-wiz-remove') return;
                ev.preventDefault();
                const enc = t.getAttribute('data-dn-enc') || '';
                let dn = '';
                try { dn = decodeURIComponent(enc); } catch (e) { dn = enc; }
                dn = String(dn || '').trim();
                if (!dn) return;
                const selSet = window.__RFQ_WIZ_SELECTED || selectedDNsState || new Set();
                selSet.delete(dn);
                window.__RFQ_WIZ_SELECTED = selSet;

                // uncheck in table if visible
                const cb = panel.querySelector(`input[type="checkbox"][data-dn-enc="${encodeURIComponent(dn)}"]`);
                if (cb) {
                    cb.checked = false;
                    const tr = cb.closest ? cb.closest('tr') : null;
                    if (tr) tr.classList.remove('rfq-wiz-selected');
                }
                if (typeof window.__RFQ_WIZ_UPDATE_UI === 'function') window.__RFQ_WIZ_UPDATE_UI();
            }, true);
            }

            const _wizGet = (it, keys) => {
                for (const k of keys) {
                    const v = it ? it[k] : '';
                    if (v !== undefined && v !== null && String(v).trim() !== '') return v;
                }
                return '';
            };
            const wizGetDN = (it) => String(_wizGet(it, [
                'item_drawing_no','drawing_no','drawing','dn',
                'part_no','part_number','item_no',
                'Drawing No','Drawing No.','DrawingNo','Drawing Number','drawing number',
                'Part No','Part No.','PartNo',
                'Item No','Item No.','Item','ITEM',
                'MPN','mfg_part_no','mfr_part_no'
            ]) || '').trim();
            const wizGetDesc = (it) => String(_wizGet(it, ['description','desc','item_description','name']) || '').trim();
            const wizGetMPN = (it) => String(_wizGet(it, ['mpn','manufacturer_part_no','mfg_part_no','part_no','part_number']) || '').trim();
            const wizGetMfr = (it) => String(_wizGet(it, ['manufacturer','mfr','mfg','brand']) || '').trim();

            const itemMatches = (it, q) => {
                if (!q) return true;
                const qq = String(q || '').toLowerCase();
                const hay = [
                    wizGetDN(it),
                    wizGetDesc(it),
                    wizGetMPN(it),
                    wizGetMfr(it)
                ].map(x => String(x || '').toLowerCase()).join(' | ');
                return hay.includes(qq);
            };

            const getCandidateItems = (supplierName) => {
                const all = (currentProject && (currentProject.items || (currentProject.data && currentProject.data.items) || (currentProject.payload && currentProject.payload.items))) || [];
                if (elShowAll && elShowAll.checked) return all;

                // Default: show only items where this supplier exists as a target (any status) OR preselected items
                return all.filter(it => {
                    const dn = wizGetDN(it);
                    if (dnSet.has(dn)) return true;
                    const sList = Array.isArray(it.suppliers) ? it.suppliers : [];
                    return sList.some(s => supplierRecMatchesSafe(currentProject, s, supplierName));
                });
            };

            const renderItems = () => {
                try {
                    const supplierName = String(getSupplierName() || '').trim();
                    const q = String((elFilter && elFilter.value) || '').trim();
                    const showAll = !!(elShowAll && elShowAll.checked);

                    if (!supplierName && !showAll) {
                        elItems.innerHTML = '<div style="text-align:center; color:#999; padding: 40px 12px;">Select a supplier (or type one) to load items</div>';
                        if (elSummary) elSummary.textContent = '0 items selected';
                        setRFQWizardBtnState(btnDraft, true);
                        setRFQWizardBtnState(btnSent, true);
                        return;
                    }

                    const allItems = (currentProject && (currentProject.items || (currentProject.data && currentProject.data.items) || (currentProject.payload && currentProject.payload.items))) || [];
                    const candidates = (getCandidateItems(supplierName) || []).filter(it => itemMatches(it, q));

                    // If supplier is chosen but no targeted items exist, automatically fall back to Show All
                    if (candidates.length === 0 && supplierName && !showAll && allItems.length > 0) {
                        if (elShowAll) elShowAll.checked = true;
                        return renderItems();
                    }
                // Reset/seed selection when supplier changes

                if (supplierName !== lastSupplierName) {

                    selectedDNsState.clear();

                    // keep explicit preselection

                    dnSet.forEach(x => { if (x) selectedDNsState.add(String(x).trim()); });

                    seededPlanned = false;

                    lastSupplierName = supplierName;

                }

                // Seed: items that are Planned for this supplier (only once per supplier selection)

                if (!seededPlanned) {

                    
(allItems || []).forEach(it => {
    const dn = wizGetDN(it);
    const planned = (it.suppliers || []).some(s => {
        if (!s) return false;
        const st = String(s.status || s.target_status || '').trim().toLowerCase();
        if (st !== 'planned') return false;
        try { return supplierRecMatchesSafe(currentProject, s, supplierName); } catch (e) { return false; }
    });
    if (planned && dn) selectedDNsState.add(String(dn).trim());
});
                    seededPlanned = true;

                }
const updateButtons = () => {
                    const count = selectedDNsState.size;
                    if (elSummary) elSummary.textContent = `${count} item(s) selected`;
                    if (elSelectedCount) elSelectedCount.textContent = String(count);

                    if (elSelected) {
                        const arr = Array.from(selectedDNsState).map(x => String(x || '').trim()).filter(Boolean).sort((a,b)=>a.localeCompare(b));
                        if (arr.length === 0) {
                            elSelected.innerHTML = '<div class="qt-empty" style="padding:14px 0;">No items selected</div>';
                        } else {
                            elSelected.innerHTML = arr.map(dn => {
                                const enc = encodeURIComponent(dn);
                                return `<span class="qt-chip">${escapeHtml(dn)} <button type="button" data-action="rfq-wiz-remove" data-dn-enc="${enc}" title="Remove">✕</button></span>`;
                            }).join('');
                        }
                    }

                    setRFQWizardBtnState(btnDraft, !(count > 0 && !!getSupplierName()));
                    setRFQWizardBtnState(btnSent, !(count > 0 && !!getSupplierName()));
                };

                elItems.innerHTML = `
                    <table class="rfq-table" style="width:100%;">
                        <thead>
                            <tr>
                                <th style="width:42px;"></th>
                                <th style="width:130px;">Item</th>
                                <th>Description</th>
                                <th style="width:80px;">Qty</th>
                                <th style="width:70px;">MOQ</th>
                                <th style="width:70px;">LT</th>
                                <th style="width:90px;">Price</th>
                                <th style="width:70px;">Curr</th>
                                <th style="width:120px;">Target status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${candidates.map((it, idx) => {
                                const dnRaw = wizGetDN(it);
                                const dn = dnRaw || String(it && (it.id || it.item_id || it.line_id) ? (it.id || it.item_id || it.line_id) : `IDX-${idx+1}`);
                                const qty = it.qty_1 ?? '';
                                let sup = null;
                                try { sup = (it.suppliers || []).find(s => supplierRecMatchesSafe(currentProject, s, supplierName)); } catch (e) { sup = null; }
                                const status = sup ? (sup.status || sup.target_status || 'Planned') : 'Not targeted';
                                const checked = selectedDNsState.has(dn) ? 'checked' : '';
                                const moq = sup ? (sup.moq || '') : '';
                                const lt = sup ? (sup.lead_time_days || sup.lead_time || '') : '';
                                const price = sup ? (sup.unit_price || sup.price || sup.price_1 || '') : '';
                                const curr = sup ? (sup.currency || sup.curr || '') : '';
                                return `
                                    <tr class="${selectedDNsState.has(dn) ? 'rfq-wiz-selected' : ''}">
                                        <td><input type="checkbox" data-dn-enc="${encodeURIComponent(dn)}" ${checked}></td>
                                        <td><b>${escapeHtml(dn)}</b></td>
                                        <td style="font-size:12px;">${escapeHtml(it.description || '')}</td>
                                        <td>${escapeHtml(String(qty))}</td>
                                        <td>${escapeHtml(String(moq))}</td>
                                        <td>${escapeHtml(String(lt))}</td>
                                        <td>${escapeHtml(String(price))}</td>
                                        <td>${escapeHtml(String(curr))}</td>
                                        <td>${escapeHtml(String(status))}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                    ${candidates.length === 0 ? `<div style="text-align:center; color:#999; padding: 18px 12px;">No items match the current selection</div>` : ''}
                `;                // Selection handlers (delegated) - survives re-renders and avoids per-row listener loss
                if (!panel.__rfqWizSelectionBound) {
                    panel.__rfqWizSelectionBound = true;

                    // Checkbox change updates the state Set (selectedDNsState)
                    panel.addEventListener('change', (ev) => {
                        const t = ev.target;
                        if (!t || String(t.tagName || '').toLowerCase() !== 'input') return;
                        if (String(t.type || '').toLowerCase() !== 'checkbox') return;
                        const enc = t.getAttribute('data-dn-enc');
                        if (!enc) return;

                        let dn = '';
                        try { dn = decodeURIComponent(String(enc).trim()); } catch (e) { dn = String(enc).trim(); }
                        dn = String(dn || '').trim();
                        if (!dn) return;

                        const selSet = window.__RFQ_WIZ_SELECTED || selectedDNsState || new Set();
                        if (t.checked) selSet.add(dn);
                        else selSet.delete(dn);
                        window.__RFQ_WIZ_SELECTED = selSet;

                        const tr = t.closest ? t.closest('tr') : null;
                        if (tr) tr.classList.toggle('rfq-wiz-selected', !!t.checked);

                        if (typeof window.__RFQ_WIZ_UPDATE_UI === 'function') window.__RFQ_WIZ_UPDATE_UI();
                    }, true);

                    // Clicking a row toggles its checkbox (better UX)
                    panel.addEventListener('click', (ev) => {
                        const t = ev.target;
                        if (!t) return;
                        if (String(t.tagName || '').toLowerCase() === 'input') return;
                        const tr = t.closest ? t.closest('tr') : null;
                        if (!tr) return;
                        const cb = tr.querySelector ? tr.querySelector('input[type="checkbox"][data-dn-enc]') : null;
                        if (!cb) return;
                        cb.checked = !cb.checked;
                        cb.dispatchEvent(new Event('change', { bubbles: true }));
                    });
                }

                // Ensure row highlight matches current state after render
                elItems.querySelectorAll('tr').forEach(tr => {
                    const cb = tr.querySelector ? tr.querySelector('input[type="checkbox"][data-dn-enc]') : null;
                    if (!cb) return;
                    tr.classList.toggle('rfq-wiz-selected', !!cb.checked);
                });

                if (typeof window.__RFQ_WIZ_UPDATE_UI === 'function') window.__RFQ_WIZ_UPDATE_UI();
                } catch (e) {
                    console.error('RFQ wizard renderItems failed', e);
                    try {
                        if (elItems) elItems.innerHTML = '<div style="text-align:center; color:#b00; padding: 24px 12px;">Cannot render items (JS error). Open console for details.</div>';
                    } catch (e2) {}
                }
};

            const refreshFromSupplierInputs = () => {
                // keep select/manual synchronized (manual wins)
                if (String(elManual.value || '').trim()) elSel.value = '';
                renderItems();
            };

            elSel.onchange = () => {
                if (String(elSel.value || '').trim()) elManual.value = String(elSel.value || '').trim();
                renderItems();
            };
            elManual.oninput = refreshFromSupplierInputs;
            if (elFilter) elFilter.oninput = renderItems;
            if (elShowAll) {
                elShowAll.onchange = renderItems;
                elShowAll.onclick = renderItems;
            }

            // Extra safety: sometimes framework re-renders can drop direct handlers.
            // Delegate inside the wizard panel so checkbox and supplier changes always refresh items.
            if (!panel.__rfqWizRefreshDelegated) {
                panel.__rfqWizRefreshDelegated = true;
                panel.addEventListener('change', (ev) => {
                    const t = ev.target;
                    if (!t || !t.id) return;
                    if (t.id === 'rfq-wiz-show-all' || t.id === 'rfq-wiz-supplier') {
                        renderItems();
                    }
                }, true);
                panel.addEventListener('input', (ev) => {
                    const t = ev.target;
                    if (!t || !t.id) return;
                    if (t.id === 'rfq-wiz-supplier-manual' || t.id === 'rfq-wiz-filter') {
                        renderItems();
                    }
                }, true);
            }

            // initial render
            renderItems();
            try { setTimeout(renderItems, 0); setTimeout(renderItems, 200); } catch (e) {}

            const createBundleFromSelection = (markSentAndExport) => {
try {
    if (window.__RFQ_CREATE_BUNDLE_LOCK) return;
    window.__RFQ_CREATE_BUNDLE_LOCK = true;
    if (!currentProject || !currentProject.id) {
        alert('Select a project first (top bar) before creating an RFQ bundle.');
        return;
    }
    if (!window.RFQData || typeof window.RFQData.saveRFQBatch !== 'function') {
        alert('RFQData not loaded. Please refresh (Ctrl+F5).');
        return;
    }
                const supplierName = getSupplierName();
                if (!supplierName) { alert('Select or type a supplier.'); return; }

                const selectedDNs = Array.from((window.__RFQ_WIZ_SELECTED || selectedDNsState || new Set())).map(x => String(x || '').trim()).filter(Boolean);
                if (selectedDNs.length === 0) { alert('Select at least one item.'); return; }

                                const qv = (sel, fallback='') => {
                    const el = panel ? panel.querySelector(sel) : null;
                    if (!el) return fallback;
                    const v = (el.value !== undefined && el.value !== null) ? el.value : fallback;
                    return (v === '' || v === null || v === undefined) ? fallback : v;
                };

                const due = qv('#rfq-wiz-due', dueDefault);

                const incoterms = qv('#rfq-wiz-incoterms', 'EXW');
                const currency = qv('#rfq-wiz-currency', 'EUR');
                const rev = String(qv('#rfq-wiz-rev', 'A')).trim() || 'A';
                const contact = String(qv('#rfq-wiz-contact', '')).trim();
                const email = String(qv('#rfq-wiz-email', '')).trim();
                const notes = String(qv('#rfq-wiz-notes', '')).trim();

                // Ensure supplier records exist on selected items
                const itemByDn = new Map((currentProject.items || []).map(it => [wizGetDN(it), it]));
                selectedDNs.forEach(dn => {
                    const it = itemByDn.get(dn);
                    if (!it) return;
                    if (!Array.isArray(it.suppliers)) it.suppliers = [];
                    let sup = it.suppliers.find(s => s && String(s.name || '').trim() === supplierName);
                    if (!sup) {
                        it.suppliers.push({ id: Date.now() + Math.floor(Math.random()*10000), name: supplierName, status: 'Planned', currency, isMain: false, price: 0, price_1: 0 });
                    }
                });

                const batch = {
                    id: Date.now(),
                    created_at: new Date().toISOString(),
                    revision: rev,
                    supplier_name: supplierName,
                    contact_person: contact,
                    contact_email: email,
                    status: markSentAndExport ? 'Sent' : 'Draft',
                    currency,
                    incoterms,
                    due_date: due,
                    notes,
                    items: selectedDNs.map(dn => ({
                        drawing_no: dn,
                        quote_status: 'Requested',
                        price: '',
                        price_1: '',
                        price_2: '',
                        price_3: '',
                        price_4: '',
                        price_5: '',
                        currency,
                        lead_time_days: '',
                        moq: '',
                        mov: '',
                        shipping_cost: '',
                        payment_terms: '',
                        packaging: '',
                        note: '',
                        valid_until: ''
                    }))
                };


                // Prefill extra fields from Item → Suppliers & Pricing (if available)
                try {
                    const itemByDn2 = new Map((currentProject.items || []).map(it => [wizGetDN(it), it]));
                    (batch.items || []).forEach(line => {
                        const dn = String(line.drawing_no || '').trim();
                        const it = itemByDn2.get(dn);
                        if (!it) return;
                        const sup = (it.suppliers || []).find(s => s && String(s.name || '').trim() === supplierName) || null;
                        if (!sup) return;
                        if (line.moq === '' || line.moq === null || line.moq === undefined) line.moq = sup.moq || '';
                        if (line.mov === '' || line.mov === null || line.mov === undefined) line.mov = sup.mov || '';
                        if (line.lead_time_days === '' || line.lead_time_days === null || line.lead_time_days === undefined) line.lead_time_days = sup.lead_time_days || sup.lead_time || '';
                        if (line.shipping_cost === '' || line.shipping_cost === null || line.shipping_cost === undefined) line.shipping_cost = sup.shipping || sup.shipping_cost || '';
                        if (line.payment_terms === '' || line.payment_terms === null || line.payment_terms === undefined) line.payment_terms = sup.payment_terms || sup.terms || '';
                        if (line.packaging === '' || line.packaging === null || line.packaging === undefined) line.packaging = sup.packaging || '';
                        if (line.note === '' || line.note === null || line.note === undefined) line.note = sup.note || sup.notes || '';
                    });
                } catch (e) {}

                // Persist
                const saved = window.RFQData.saveRFQBatch(currentProject.id, batch);
                syncProjectBatchesIntoMemory(currentProject);
                applyBatchToItems(currentProject, batch, markSentAndExport ? 'sent' : 'save');
                updateProject(currentProject);
                renderRFQHistory();

                // If sent: update target statuses and export
                if (markSentAndExport) {
                    (currentProject.items || []).forEach(it => {
                        const dn = String(it.item_drawing_no || '').trim();
                        if (!selectedDNs.includes(dn)) return;
                        const sup = (it.suppliers || []).find(s => s && String(s.name || '').trim() === supplierName);
                        if (sup) sup.status = 'RFQ Sent';
                        if (String(it.status || '') === 'New') it.status = 'RFQ Sent';
                    });
                    window.RFQData.updateProject(currentProject);
                    exportBatchCSV(batch);
                }

                // Open detail
                openBundleDetailPage((saved && saved.id) ? saved.id : batch.id, 'quoting');
                } catch (err) {
                    console.error('Create RFQ bundle failed', err);
                    alert('Create bundle failed: ' + (err && err.message ? err.message : String(err)));
                } finally {
                    window.__RFQ_CREATE_BUNDLE_LOCK = false;
                }
            };

            window.RFQWizardHandlers = {
                _updateButtons: () => { try { if (typeof window.__RFQ_WIZ_UPDATE_UI === 'function') window.__RFQ_WIZ_UPDATE_UI(); } catch(e){} },
                createDraft: () => createBundleFromSelection(false),
                createSent: () => createBundleFromSelection(true),
                cancel: () => resetRFQWizard()
            };
        }
    }
}
 

// =========================================================
// Global RFQ Wizard event delegation (robust buttons)
// =========================================================
;(function () {
    if (window.__RFQ_WIZ_DELEGATED__) return;
    window.__RFQ_WIZ_DELEGATED__ = true;

// Selection delegation for RFQ wizard items (robust across re-renders)
if (!window.__RFQ_WIZ_SELECTION_DELEGATED__) {
    window.__RFQ_WIZ_SELECTION_DELEGATED__ = true;

    // checkbox change inside wizard item list
    document.addEventListener('change', function(ev){
        const t = ev.target;
        if (!t) return;
        if (String(t.tagName||'').toLowerCase() !== 'input') return;
        if (String(t.type||'').toLowerCase() !== 'checkbox') return;
        const enc = t.getAttribute('data-dn-enc');
        if (!enc) return;
        // only handle inside wizard list
        const root = t.closest ? t.closest('#rfq-wiz-items') : null;
        if (!root) return;

        let dn = '';
        try { dn = decodeURIComponent(String(enc).trim()); } catch(e){ dn = String(enc).trim(); }
        dn = String(dn||'').trim();
        if (!dn) return;

        window.__RFQ_WIZ_SELECTED = window.__RFQ_WIZ_SELECTED || new Set();
        if (t.checked) window.__RFQ_WIZ_SELECTED.add(dn);
        else window.__RFQ_WIZ_SELECTED.delete(dn);

        const tr = t.closest ? t.closest('tr') : null;
        if (tr) tr.classList.toggle('rfq-wiz-selected', !!t.checked);

        // update wizard UI consistently even after re-renders
        if (window.RFQWizardHandlers && typeof window.RFQWizardHandlers._updateButtons === 'function') {
            try { window.RFQWizardHandlers._updateButtons(); } catch (e) {}
        }
        if (typeof window.__RFQ_WIZ_UPDATE_UI === 'function') {
            try { window.__RFQ_WIZ_UPDATE_UI(); } catch (e) {}
        }
    }, true);

    // click row toggles checkbox
    document.addEventListener('click', function(ev){
        const t = ev.target;
        if (!t) return;
        const itemsRoot = t.closest ? t.closest('#rfq-wiz-items') : null;
        if (!itemsRoot) return;
        if (String(t.tagName||'').toLowerCase() === 'input') return;
        const tr = t.closest ? t.closest('tr') : null;
        if (!tr) return;
        const cb = tr.querySelector ? tr.querySelector('input[type="checkbox"][data-dn-enc]') : null;
        if (!cb) return;
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
    }, false);
}

    document.addEventListener('click', function (e) {
        const btn = e.target && e.target.closest ? e.target.closest('[data-rfq-action]') : null;
        if (!btn) return;
        const act = String(btn.getAttribute('data-rfq-action') || '');
        if (!act) return;
        if (String(btn.dataset.disabled || '') === '1' || btn.getAttribute('aria-disabled') === 'true') {
            e.preventDefault();
            alert('Select at least one item to create an RFQ bundle.');
            return;
        }
        const h = window.RFQWizardHandlers || {};
        if (act === 'wiz-create-draft' && typeof h.createDraft === 'function') {
            e.preventDefault();
            h.createDraft();
        } else if (act === 'wiz-create-sent' && typeof h.createSent === 'function') {
            e.preventDefault();
            h.createSent();
        }
    }, true);
})();



// Standalone mount helper (no window manager required)
window.RFQStandalone = window.RFQStandalone || {};
window.RFQStandalone.mount = function (rootSelectorOrEl) {
    const root = typeof rootSelectorOrEl === 'string'
        ? document.querySelector(rootSelectorOrEl)
        : rootSelectorOrEl;
    if (!root) return;
    if (!window.SystemApps || !window.SystemApps.rfq) return;
    root.innerHTML = window.SystemApps.rfq.render();
    window.SystemApps.rfq.init(root);
};



/* ===================== v58 Deep Wizard Stability Patch (plus DATA Manager) ===================== */
(function(){
  try { window.__RFQ_BUILD_VERSION__ = 'v64_4'; } catch(e){}
  // Guard: only patch once
  if (window.__RFQ_V58_WIZ_PATCH__) return;
  window.__RFQ_V58_WIZ_PATCH__ = true;

  function safeStr(x){ return (x===null||x===undefined) ? '' : String(x); }

  // Robustly resolve current project (wizard should always have items from a real project)
  function resolveWizardProject(){
    try {
      const st = window.__RFQ_WIZ_STATE__ || {};
      const pid = st.projectId || (typeof currentProject !== 'undefined' && currentProject ? currentProject.id : null);
      if (pid && window.RFQData && typeof window.RFQData.getProjects === 'function') {
        const ps = window.RFQData.getProjects();
        const p = ps.find(pp => String(pp.id) === String(pid));
        if (p) return p;
      }
    } catch(e){}
    try { if (typeof currentProject !== 'undefined' && currentProject) return currentProject; } catch(e){}
    return null;
  }

  function getWizardEls(){
    const panel = document.getElementById('rfq-bundle-wizard');
    if (!panel) return null;
    return {
      panel,
      supplier: panel.querySelector('#rfq-wiz-supplier'),
      supplierText: panel.querySelector('#rfq-wiz-supplier-text'),
      showAll: panel.querySelector('#rfq-wiz-show-all'),
      filter: panel.querySelector('#rfq-wiz-filter'),
      itemsRoot: panel.querySelector('#rfq-wiz-items'),
      summary: panel.querySelector('#rfq-wiz-summary'),
      btnDraft: panel.querySelector('#rfq-wiz-create-draft'),
      btnSent: panel.querySelector('#rfq-wiz-create-sent'),
      debug: panel.querySelector('#rfq-wiz-debug')
    };
  }

  function wizGet(it, keys){
    for (const k of keys){
      if (!k) continue;
      const v = it && it[k];
      if (v !== undefined && v !== null && String(v).trim() !== '') return v;
    }
    return '';
  }

  function wizDN(it){
    return safeStr(wizGet(it, ['item_drawing_no','drawing_no','drawing','dn','part_no','part_number','item_no','mpn','mfg_part_no','mfr_part_no'])).trim();
  }
  function wizDesc(it){
    return safeStr(wizGet(it, ['description','desc','item_description','name'])).trim();
  }
  function wizMPN(it){
    return safeStr(wizGet(it, ['mpn','mfg_part_no','mfr_part_no','manufacturer_part','part_no','part_number'])).trim();
  }
  function wizMfr(it){
    return safeStr(wizGet(it, ['manufacturer','mfr','brand','mfg'])).trim();
  }

  function supplierNameFromUI(els){
    const sel = els.supplier;
    const txt = els.supplierText;
    const a = sel ? safeStr(sel.value).trim() : '';
    const b = txt ? safeStr(txt.value).trim() : '';
    return b || a;
  }

  function ensureState(){
    window.__RFQ_WIZ_STATE__ = window.__RFQ_WIZ_STATE__ || { projectId: null, selected: [] };
    const st = window.__RFQ_WIZ_STATE__;
    const p = resolveWizardProject();
    if (p && !st.projectId) st.projectId = p.id;
    if (!Array.isArray(st.selected)) st.selected = [];
    return st;
  }

  function getSelectedSet(){
    const st = ensureState();
    if (!st._set || !(st._set instanceof Set)) st._set = new Set(st.selected.map(x=>safeStr(x).trim()).filter(Boolean));
    return st._set;
  }

  function persistSelectedSet(){
    const st = ensureState();
    const set = getSelectedSet();
    st.selected = Array.from(set);
  }

  function setBtnEnabled(btn, enabled){
    if (!btn) return;
    // do not use true disabled (it looks dead). Keep clickable with explanation in handler.
    btn.setAttribute('data-disabled', enabled ? '0' : '1');
    btn.classList.toggle('is-disabled', !enabled);
  }

  function renderWizardItems(forceReason){
    const els = getWizardEls();
    if (!els || !els.itemsRoot) return;

    const st = ensureState();
    const proj = resolveWizardProject();
    const items = proj && Array.isArray(proj.items) ? proj.items : [];

    const supplierName = supplierNameFromUI(els);
    const showAll = !!(els.showAll && els.showAll.checked);
    const q = safeStr(els.filter ? els.filter.value : '').trim().toLowerCase();

    st.supplier = supplierName;
    st.showAll = showAll;
    st.filter = q;

    const selectedSet = getSelectedSet();

    // Candidate items
    let candidates = items;
    if (!supplierName) {
      els.itemsRoot.innerHTML = '<div style="text-align:center; color:#999; padding: 40px 12px;">Select a supplier (or type one) to load items</div>';
      if (els.summary) els.summary.textContent = selectedSet.size + ' items selected';
      setBtnEnabled(els.btnDraft, false);
      setBtnEnabled(els.btnSent, false);
      if (els.debug) els.debug.textContent = '';
      return;
    }

    if (!showAll) {
      candidates = items.filter(it => {
        const dn = wizDN(it);
        if (selectedSet.has(dn)) return true;
        const sList = Array.isArray(it.suppliers) ? it.suppliers : [];
        // match by name OR by supplier_id (compat)
        return sList.some(s => s && (safeStr(s.name).trim() === supplierName || safeStr(s.supplier_id).trim() === supplierName));
      });
    }

    if (q) {
      candidates = candidates.filter(it => {
        const hay = (wizDN(it) + ' | ' + wizDesc(it) + ' | ' + wizMPN(it) + ' | ' + wizMfr(it)).toLowerCase();
        return hay.includes(q);
      });
    }

    // Render table (always)
    const rows = candidates.map(it => {
      const dn = wizDN(it);
      const qty = (it && (it.qty_1 ?? it.qty ?? '')) ?? '';
      const checked = selectedSet.has(dn);
      const trClass = checked ? 'rfq-wiz-selected' : '';
      const enc = encodeURIComponent(dn);
      return `
        <tr class="${trClass}" data-dn-enc="${enc}">
          <td><input type="checkbox" data-dn-enc="${enc}" ${checked ? 'checked' : ''}></td>
          <td><b>${escapeHtml(dn)}</b></td>
          <td style="font-size:12px;">${escapeHtml(wizDesc(it))}</td>
          <td>${escapeHtml(String(qty))}</td>
          <td>${escapeHtml(wizMfr(it))}</td>
          <td>${escapeHtml(wizMPN(it))}</td>
        </tr>
      `;
    }).join('');

    els.itemsRoot.innerHTML = `
      <table class="macos-table" style="width:100%; border-collapse:collapse;">
        <thead>
          <tr>
            <th style="width:38px;"></th>
            <th style="width:140px;">Item</th>
            <th>Description</th>
            <th style="width:80px;">Qty</th>
            <th style="width:120px;">Mfr</th>
            <th style="width:160px;">MPN</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      ${candidates.length === 0 ? '<div style="text-align:center; color:#999; padding:18px 12px;">No items match the current selection</div>' : ''}
    `;

    if (els.summary) els.summary.textContent = selectedSet.size + ' selected | Items: ' + items.length + ' | View: ' + candidates.length;

    const canCreate = supplierName && selectedSet.size > 0;
    setBtnEnabled(els.btnDraft, canCreate);
    setBtnEnabled(els.btnSent, canCreate);

    if (els.debug) {
      els.debug.textContent = `Project items: ${items.length} | Candidates: ${candidates.length} | Selected: ${selectedSet.size}` + (forceReason ? ` | ${forceReason}` : '');
    }
  }

  // Global delegation for wizard selection & controls (works even if wizard re-renders)
  if (!window.__RFQ_V56_WIZ_DELEGATED__) {
    window.__RFQ_V56_WIZ_DELEGATED__ = true;

    document.addEventListener('change', function(ev){
      const t = ev.target;
      if (!t) return;
      const panel = t.closest ? t.closest('#rfq-bundle-wizard') : null;
      if (!panel) return;

      // Supplier change / show all / filter change -> re-render
      const id = t.id ? String(t.id) : '';
      if (id === 'rfq-wiz-supplier' || id === 'rfq-wiz-supplier-text' || id === 'rfq-wiz-show-all' || id === 'rfq-wiz-filter') {
        // If supplier selected and items list empty, force showAll to avoid "nothing" confusion
        try {
          if (id === 'rfq-wiz-supplier' || id === 'rfq-wiz-supplier-text') {
            const els = getWizardEls();
            if (els && els.showAll && els.itemsRoot) {
              // if no candidates under targets, user can still see all quickly
              // (we do not auto-toggle here, just re-render)
            }
          }
        } catch(e){}
        renderWizardItems('ui-change');
        return;
      }

      // Checkbox item selection
      if (String(t.tagName||'').toLowerCase() === 'input' && String(t.type||'').toLowerCase() === 'checkbox') {
        const enc = t.getAttribute('data-dn-enc');
        if (!enc) return;
        // only handle inside rfq-wiz-items
        const root = t.closest ? t.closest('#rfq-wiz-items') : null;
        if (!root) return;
        const dn = decodeURIComponent(enc);
        const set = getSelectedSet();
        if (t.checked) set.add(dn);
        else set.delete(dn);
        persistSelectedSet();
        // reflect row highlight
        try {
          const tr = t.closest ? t.closest('tr') : null;
          if (tr) tr.classList.toggle('rfq-wiz-selected', t.checked);
        } catch(e){}
        renderWizardItems('selection');
      }
    }, true);

    // Click row toggles checkbox
    document.addEventListener('click', function(ev){
      const t = ev.target;
      if (!t) return;
      const itemsRoot = t.closest ? t.closest('#rfq-wiz-items') : null;
      if (!itemsRoot) return;
      if (String(t.tagName||'').toLowerCase() === 'input') return;
      const tr = t.closest ? t.closest('tr[data-dn-enc]') : null;
      if (!tr) return;
      const cb = tr.querySelector ? tr.querySelector('input[type="checkbox"][data-dn-enc]') : null;
      if (!cb) return;
      cb.checked = !cb.checked;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
    }, false);

    // Create buttons
    document.addEventListener('click', function(ev){
      const btn = ev.target && ev.target.closest ? ev.target.closest('[data-rfq-action]') : null;
      if (!btn) return;
      const act = String(btn.getAttribute('data-rfq-action') || '');
      if (act !== 'wiz-create-draft' && act !== 'wiz-create-sent') return;

      const els = getWizardEls();
      const supplierName = els ? supplierNameFromUI(els) : '';
      const selectedSet = getSelectedSet();

      // validations with clear message
      if (!supplierName) { ev.preventDefault(); alert('Select a supplier.'); return; }
      if (selectedSet.size === 0) { ev.preventDefault(); alert('Select at least one item.'); return; }

      // allow existing handlers to run
      try {
        if (window.RFQWizardHandlers) {
          if (act === 'wiz-create-draft' && typeof window.RFQWizardHandlers.createDraft === 'function') {
            ev.preventDefault();
            window.RFQWizardHandlers.createDraft();
          } else if (act === 'wiz-create-sent' && typeof window.RFQWizardHandlers.createSent === 'function') {
            ev.preventDefault();
            window.RFQWizardHandlers.createSent();
          }
        }
      } catch (e) {
        console.error(e);
        alert('Create bundle failed: ' + (e && e.message ? e.message : String(e)));
      }
    }, true);
  }

  // Patch startRFQWizard to store stable project id and force an initial render
  if (typeof startRFQWizard === 'function' && !startRFQWizard.__v56Patched) {
    const _orig = startRFQWizard;
    const wrapped = function(preselectedSupplierName = null, preselectedItemDNs = []) {
      // ensure state before original wizard builds
      try {
        const st = ensureState();
        const p = resolveWizardProject();
        if (p) st.projectId = p.id;
        const set = getSelectedSet();
        (Array.isArray(preselectedItemDNs) ? preselectedItemDNs : []).map(x=>safeStr(x).trim()).filter(Boolean).forEach(dn=>set.add(dn));
        persistSelectedSet();
        st.supplier = preselectedSupplierName ? safeStr(preselectedSupplierName).trim() : (st.supplier || '');
      } catch(e){}
      const res = _orig(preselectedSupplierName, preselectedItemDNs);
      // force render after DOM is there
      try {
        requestAnimationFrame(()=>{ renderWizardItems('init'); });
        setTimeout(()=>{ renderWizardItems('init+150ms'); }, 150);
      } catch(e){}
      return res;
    };
    wrapped.__v56Patched = true;
    // overwrite
    try { startRFQWizard = wrapped; } catch(e){}
  }

})();

// ===== RFQ_BULK_UPLOAD_DELEGATION (safety) =====
(function(){
  try{
    document.addEventListener('click', function(ev){
      const t = ev.target;
      if(!t) return;
      if(t.id === 'btn-upload-bulk-quote'){
        // if normal handler is attached, let it run
        // but if button is disabled due to layout bugs, provide guidance
        if (t.disabled) {
          const sel = document.getElementById('bulk-supplier-select');
          const name = sel ? String(sel.value||'').trim() : '';
          if(!name) alert('Select supplier first.');
        }
      }
    }, true);
  }catch(e){}
})();





/* ===================== Detail Buttons Delegation Patch (v64_4) ===================== */
(function(){
  try { if (window.__RFQ_DETAIL_DELEGATES__) return; window.__RFQ_DETAIL_DELEGATES__ = true; } catch(e) {}

  function getBtn(target){
    try { return target && target.closest ? target.closest('button') : null; } catch(e) { return null; }
  }

  function safeCall(fn, arg){
    try { if (typeof fn === 'function') fn(arg); } catch(e) { console.error(e); }
  }

  document.addEventListener('click', function(ev){
    const b = getBtn(ev.target) || ev.target;
    const id = b && b.id ? String(b.id) : '';
    if (!id) return;

    // Item Detail buttons
    if (id === 'btn-item-detail-save-back') { ev.preventDefault(); safeCall(window.handleUložitDetail, true); return; }
    if (id === 'btn-item-detail-save') { ev.preventDefault(); safeCall(window.handleUložitDetail, false); return; }
    if (id === 'btn-item-detail-back') { ev.preventDefault(); safeCall(window.closeDetailWindow); return; }

    // Supplier Detail buttons - trigger content buttons
    if (id === 'btn-supplier-detail-save-back') {
        ev.preventDefault();
        const btn = document.querySelector('#sd-save-close');
        if (btn) btn.click();
        return;
    }
    if (id === 'btn-supplier-detail-save') {
        ev.preventDefault();
        const btn = document.querySelector('#sd-save');
        if (btn) btn.click();
        return;
    }
    if (id === 'btn-supplier-detail-back') {
        ev.preventDefault();
        const btn = document.querySelector('#sd-close');
        if (btn) btn.click();
        return;
    }

    // Legacy overlay buttons
    if (id === 'btn-save-detail') { ev.preventDefault(); safeCall(window.handleUložitDetail, true); return; }
    if (id === 'btn-save-detail-no-close') { ev.preventDefault(); safeCall(window.handleUložitDetail, false); return; }
    if (id === 'btn-close-detail-window') { ev.preventDefault(); safeCall(window.closeDetailWindow); return; }
  }, true);
})();

