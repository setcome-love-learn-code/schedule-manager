import { useState } from 'react';
import type { Item, ItemType, Priority } from '../../types/item';
import { useAppContext } from '../../hooks/useAppContext';
import { generateId, generateTimestamp } from '../../utils/id';
import TagInput from '../common/TagInput';

interface ItemFormProps {
  item?: Item;
  defaultType?: ItemType;
  onClose: () => void;
}

export default function ItemForm({ item, defaultType = 'task', onClose }: ItemFormProps) {
  const { dispatch } = useAppContext();
  const isEdit = !!item;

  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [type, setType] = useState<ItemType>(item?.type || defaultType);
  const [priority, setPriority] = useState<Priority>(item?.priority || 'medium');
  const [tags, setTags] = useState<string[]>(item?.tags || []);
  const [dueDate, setDueDate] = useState(item?.dueDate?.slice(0, 10) || '');
  const [startDate, setStartDate] = useState(item?.startDate?.slice(0, 10) || '');
  const [endDate, setEndDate] = useState(item?.endDate?.slice(0, 10) || '');
  const [courseName, setCourseName] = useState(item?.courseName || '');
  const [totalHours, setTotalHours] = useState(item?.totalHours?.toString() || '');
  const [location, setLocation] = useState(item?.location || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const now = generateTimestamp();
    const base = {
      title: title.trim(),
      description: description.trim(),
      type,
      priority,
      tags,
      isAllDay: true,
      dueDate: dueDate || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    if (item) {
      dispatch({
        type: 'UPDATE_ITEM',
        payload: {
          id: item.id,
          changes: {
            ...base,
            ...(type === 'learning' ? { courseName: courseName.trim(), totalHours: totalHours ? Number(totalHours) : undefined } : {}),
            ...(type === 'event' ? { location: location.trim() } : {}),
          },
        },
      });
    } else {
      const newItem: Item = {
        id: generateId(),
        ...base,
        status: 'todo',
        timestamps: { createdAt: now, updatedAt: now },
        ...(type === 'learning' ? { courseName: courseName.trim(), totalHours: totalHours ? Number(totalHours) : undefined, loggedHours: 0, milestones: [] } : {}),
        ...(type === 'event' ? { location: location.trim(), reminderMinutes: [10, 60] } : {}),
        ...(type === 'project' ? { phases: [], projectTasks: [], progress: 0 } : {}),
      } as Item;
      dispatch({ type: 'CREATE_ITEM', payload: newItem });
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">标题 *</label>
        <input
          className="form-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="需要做什么？"
          required
          autoFocus
        />
      </div>

      <div className="form-group">
        <label className="form-label">描述</label>
        <textarea
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="添加详细信息..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">类型</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value as ItemType)}
            disabled={isEdit}
          >
            <option value="task">任务</option>
            <option value="learning">学习</option>
            <option value="project">项目</option>
            <option value="event">事件</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">优先级</label>
          <select
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
            <option value="urgent">紧急</option>
          </select>
        </div>
      </div>

      {type === 'task' && (
        <div className="form-group">
          <label className="form-label">截止日期</label>
          <input
            className="form-input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      )}

      {type === 'learning' && (
        <>
          <div className="form-group">
            <label className="form-label">课程/技能名称</label>
            <input
              className="form-input"
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="例如：React、钢琴、西班牙语"
            />
          </div>
          <div className="form-group">
            <label className="form-label">总时长（小时）</label>
            <input
              className="form-input"
              type="number"
              value={totalHours}
              onChange={(e) => setTotalHours(e.target.value)}
              placeholder="目标小时数"
              min="0"
              step="0.5"
            />
          </div>
        </>
      )}

      {type === 'event' && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">开始日期</label>
              <input
                className="form-input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">结束日期</label>
              <input
                className="form-input"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">地点</label>
            <input
              className="form-input"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="例如：301 会议室、线上"
            />
          </div>
        </>
      )}

      {type === 'project' && (
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">开始日期</label>
            <input
              className="form-input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">截止日期</label>
            <input
              className="form-input"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">标签</label>
        <TagInput tags={tags} onChange={setTags} />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn--secondary" onClick={onClose}>
          取消
        </button>
        <button type="submit" className="btn btn--primary">
          {isEdit ? '更新' : '创建'}
        </button>
      </div>
    </form>
  );
}
