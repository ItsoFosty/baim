export class QuestSystem {
  constructor(questsById, state) {
    this.questsById = questsById;
    this.state = state;
  }

  activate(questId) {
    if (!this.state.activeQuests.includes(questId) && !this.state.completedQuests.includes(questId) && !this.state.expiredQuests?.includes(questId)) {
      this.state.activeQuests.push(questId);
    }
  }

  start(questId) {
    this.activate(questId);
  }

  complete(questId) {
    this.state.activeQuests = this.state.activeQuests.filter((id) => id !== questId);
    if (!this.state.completedQuests.includes(questId)) this.state.completedQuests.push(questId);
  }

  expire(questId) {
    if (this.state.completedQuests.includes(questId)) return;
    this.state.activeQuests = this.state.activeQuests.filter((id) => id !== questId);
    this.state.expiredQuests ||= [];
    if (!this.state.expiredQuests.includes(questId)) this.state.expiredQuests.push(questId);
  }

  active() {
    return this.state.activeQuests.map((id) => this.questsById[id]).filter(Boolean);
  }

  completed() {
    return this.state.completedQuests.map((id) => this.questsById[id]).filter(Boolean);
  }
}
