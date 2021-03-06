import type { GuildMember } from 'discord.js';
import { joinRole } from '../utils/members/joinRole';
import { updateMemberCount } from '../utils/members/updateMemberCount';

import { upsertDbMember } from '../utils/members/upsertDbMember';

export default {
  name: 'guildMemberAdd',
  once: false,
  async execute(member: GuildMember) {
    // create or update user with his roles
    await upsertDbMember(member, 'join');

    // update user count channel
    await updateMemberCount(member);

    // rules not yet accepted
    if (member.pending) return;

    // if first time user give him status role
    await joinRole(member);
  },
};
