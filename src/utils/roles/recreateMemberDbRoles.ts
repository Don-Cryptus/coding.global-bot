import { Prisma, PrismaClient } from '@prisma/client';
import type { GuildMember } from 'discord.js';
import { EVERYONE } from '../constants';

const prisma = new PrismaClient();

export const recreateMemberDbRoles = async (member: GuildMember) => {
  // return if member is bot
  if (member.user.bot) return;

  // get member and guild info
  const memberId = member.id;
  const guildId = member.guild.id;

  // delete all member roles because maybe they were deleted on the users side
  await prisma.memberRole.deleteMany({
    where: {
      memberId,
      guildId,
    },
  });

  // create empty role array input
  const roles: Prisma.MemberRoleUncheckedCreateInput[] = [];

  // map over current member roles
  for (let roleCollection of member.roles.cache) {
    const role = roleCollection[1];

    // if role is everyone continue
    if (role.name === EVERYONE) continue;
    // if role higher then bot continue
    if (!role.editable) continue;

    // create member role input
    const memberRole: Prisma.MemberRoleUncheckedCreateInput = {
      roleId: role.id,
      memberId,
      guildId,
    };

    // push role to array
    roles.push(memberRole);
  }

  // insert array of roles for the member, skip duplicates
  await prisma.memberRole.createMany({ data: roles, skipDuplicates: true });
};
