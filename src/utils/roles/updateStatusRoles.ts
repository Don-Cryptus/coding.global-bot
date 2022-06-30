import type { GuildMember, PartialGuildMember } from 'discord.js';
import type { StatusRoles } from '../../types/types';
import { statusRoles } from '../constants';
import { joinRole } from '../members/joinRole';

export const updateStatusRoles = async (
  oldMember: GuildMember | PartialGuildMember,
  newMember: GuildMember | PartialGuildMember
) => {
  const oldRoles = oldMember.roles.cache
    .filter((role) => role.name !== '@everyone')
    .map((role) => role.name);
  const newRoles = newMember.roles.cache
    .filter((role) => role.name !== '@everyone')
    .map((role) => role.name);

  // if somehow user has no role make him unverfied
  if (!newRoles.length) joinRole(newMember as GuildMember);
  // only run if user has a new role
  if (oldRoles.length >= newRoles.length) return;

  const newAddedRole = newRoles.filter(
    (role) => !oldRoles.includes(role)
  )[0] as StatusRoles;

  // check if role is a status role if yes then remove the unused status role
  if (statusRoles.includes(newAddedRole)) {
    const unusedRoles = statusRoles.filter((role) => newAddedRole !== role);
    unusedRoles.forEach((roleName) => {
      const role = newMember.roles.cache.find((r) => r.name === roleName);
      if (role) newMember.roles.remove(role);
    });
  }
};