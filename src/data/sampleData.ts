import type { Item } from '../types/item';
import { generateId, generateTimestamp } from '../utils/id';

export function generateSampleData(): Item[] {
  const now = generateTimestamp();
  const today = new Date().toISOString().slice(0, 10);

  const tasks: Item[] = [
    {
      id: generateId(),
      type: 'task',
      title: '审阅项目提案',
      description: '查看 Q3 提案文档并给出反馈意见。',
      status: 'todo',
      priority: 'high',
      tags: ['工作', '审阅'],
      isAllDay: true,
      dueDate: today,
      timestamps: { createdAt: now, updatedAt: now },
      checklist: [
        { id: generateId(), text: '阅读执行摘要', done: false },
        { id: generateId(), text: '检查预算部分', done: false },
        { id: generateId(), text: '撰写反馈', done: false },
      ],
    },
    {
      id: generateId(),
      type: 'task',
      title: '买日用品',
      description: '牛奶、鸡蛋、面包、蔬菜',
      status: 'in_progress',
      priority: 'medium',
      tags: ['个人'],
      isAllDay: false,
      timestamps: { createdAt: now, updatedAt: now },
    },
    {
      id: generateId(),
      type: 'task',
      title: '修复登录页面 Bug',
      description: '用户反馈 Safari 浏览器上出现 401 错误',
      status: 'todo',
      priority: 'urgent',
      tags: ['工作', 'Bug'],
      isAllDay: true,
      dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      timestamps: { createdAt: now, updatedAt: now },
    },
  ];

  const learning: Item[] = [
    {
      id: generateId(),
      type: 'learning',
      title: 'React 精通之路',
      description: '深入学习 React 高级模式和最佳实践',
      status: 'in_progress',
      priority: 'high',
      tags: ['编程', '前端'],
      isAllDay: true,
      courseName: 'React 19',
      totalHours: 40,
      loggedHours: 12,
      milestones: [
        { id: generateId(), title: '服务端组件', completed: true },
        { id: generateId(), title: 'Actions 与 Hooks', completed: false },
        { id: generateId(), title: 'Suspense 模式', completed: false },
      ],
      timestamps: { createdAt: now, updatedAt: now },
    },
    {
      id: generateId(),
      type: 'learning',
      title: '西班牙语基础',
      description: '多邻国西班牙语课程',
      status: 'in_progress',
      priority: 'medium',
      tags: ['语言'],
      isAllDay: true,
      courseName: '西班牙语',
      totalHours: 20,
      loggedHours: 5,
      milestones: [
        { id: generateId(), title: '问候语', completed: true },
        { id: generateId(), title: '数字', completed: true },
        { id: generateId(), title: '过去时态', completed: false },
      ],
      timestamps: { createdAt: now, updatedAt: now },
    },
  ];

  const projects: Item[] = [
    {
      id: generateId(),
      type: 'project',
      title: '网站改版',
      description: '重新设计公司官网和仪表盘',
      status: 'in_progress',
      priority: 'high',
      tags: ['工作', '设计'],
      isAllDay: true,
      progress: 45,
      phases: [
        { id: generateId(), name: '调研', order: 0, status: 'completed' },
        { id: generateId(), name: '设计', order: 1, status: 'completed' },
        { id: generateId(), name: '开发', order: 2, status: 'in_progress' },
        { id: generateId(), name: '测试', order: 3, status: 'not_started' },
        { id: generateId(), name: '上线', order: 4, status: 'not_started' },
      ],
      projectTasks: [
        { id: generateId(), title: '用户访谈', phaseId: '', status: 'done' },
        { id: generateId(), title: '线框图', phaseId: '', status: 'done' },
        { id: generateId(), title: '首页开发', phaseId: '', status: 'in_progress' },
        { id: generateId(), title: '仪表盘开发', phaseId: '', status: 'todo' },
      ],
      timestamps: { createdAt: now, updatedAt: now },
    },
  ];

  const events: Item[] = [
    {
      id: generateId(),
      type: 'event',
      title: '团队站会',
      description: '每日站会',
      status: 'todo',
      priority: 'medium',
      tags: ['工作', '会议'],
      isAllDay: false,
      startDate: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
      endDate: new Date(new Date().setHours(9, 15, 0, 0)).toISOString(),
      location: 'Zoom 会议室 A',
      timestamps: { createdAt: now, updatedAt: now },
    },
  ];

  return [...tasks, ...learning, ...projects, ...events];
}
