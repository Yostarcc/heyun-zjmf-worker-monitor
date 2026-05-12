import assert from 'node:assert/strict';
import test from 'node:test';

import { renderStatusPage } from '../src/status-page.js';

test('状态页渲染服务器状态并转义 HTML', () => {
  const html = renderStatusPage([
    {
      id: '8564',
      name: '<script>alert(1)</script>',
      provider: 'heyunidc',
      state: 'healthy',
      last_status_value: 'on',
      last_check_time: 1778384953,
      last_reboot_time: 0,
      reboot_count_today: 0,
      check_method: 'tcp',
    },
  ]);

  assert.match(html, /ZJMF 服务器监控/);
  assert.match(html, /--bg:#f6f8fb/);
  assert.match(html, /服务/);
  assert.match(html, /未分组/);
  assert.match(html, /status-card/);
  assert.match(html, /近 30 天可用性/);
  assert.match(html, /最近 60 次探测/);
  assert.match(html, /class="day-track"/);
  assert.match(html, /aria-label="近 30 天每日可用性"/);
  assert.equal((html.match(/class="day-segment/g) || []).length, 30);
  assert.match(html, /100\.000% 可用率/);
  assert.match(html, /不可用时长 0s/);
  assert.match(html, /box-shadow:0 0 0 2px #fff/);
  assert.match(html, /translateY\(-7px\)/);
  assert.match(html, /data-tip=/);
  assert.match(html, /aria-label="最近探测详情"/);
  assert.match(html, /tcp/);
  assert.match(html, /管理面板/);
  assert.match(html, /href="\/admin"/);
  assert.match(html, /运行正常/);
  assert.match(html, /24 小时重启/);
  assert.doesNotMatch(html, /本小时重启|今日重启/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>alert/);
});

test('状态页不显示服务器 IP，名称为 IP 时改用泛化名称', () => {
  const html = renderStatusPage([
    {
      id: '8564',
      name: '203.0.113.10',
      ip: '203.0.113.10',
      provider: 'heyunidc',
      state: 'healthy',
      last_status_value: 'on',
      last_check_time: 1778384953,
      last_reboot_time: 0,
      reboot_count_today: 0,
    },
  ]);

  assert.match(html, /服务器 #8564/);
  assert.doesNotMatch(html, /203\.0\.113\.10/);
});
