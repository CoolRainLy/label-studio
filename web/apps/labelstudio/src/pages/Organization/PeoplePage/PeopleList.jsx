import { formatDistance } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Pagination, Spinner, Userpic } from "../../../components";
import { usePage, usePageSize } from "../../../components/Pagination/Pagination";
import { useAPI } from "../../../providers/ApiProvider";
import { Block, Elem } from "../../../utils/bem";
import { isDefined } from "../../../utils/helpers";
import { useUpdateEffect } from "../../../utils/hooks";
import "./PeopleList.scss";
import { CopyableTooltip } from "../../../components/CopyableTooltip/CopyableTooltip";
import { Switch } from 'antd';
import {checkIsSuperuser, checkPermission} from "../../../utils/check-permission";

export const PeopleList = (
  {
    onSelect,
    selectedUser,
    defaultSelected,
    fetchUsers,
    currentPage,
    currentPageSize,
    usersList,
    setUsersList,
    totalItems,
    setTotalItems,
  }) => {
  const api = useAPI();

  const selectUser = useCallback(
    (user) => {
      if (selectedUser?.id === user.id) {
        onSelect?.(null);
      } else {
        onSelect?.(user);
      }
    },
    [selectedUser],
  );

  useEffect(() => {
    fetchUsers(currentPage, currentPageSize);
  }, []);

  useEffect(() => {
    if (isDefined(defaultSelected) && usersList) {
      const selected = usersList.find(({ user }) => user.id === Number(defaultSelected));

      if (selected) selectUser(selected.user);
    }
  }, [usersList, defaultSelected]);

  const changeUserStatus = async (status, user) => {
    user.statusLoading = true
    setUsersList(JSON.parse(JSON.stringify(usersList)))

    await api.callApi("updateUserStatus", {
      params: {
        status: status ? 1 : 0,
        user_id: user.id
      }
    })

    await fetchUsers(currentPage, currentPageSize);
  }

  const changeUserStaff = async (staff, user) => {
    user.staffLoading = true
    setUsersList(JSON.parse(JSON.stringify(usersList)))

    await api.callApi("updateUserStaff", {
      params: {
        staff: staff ? 1 : 0,
        user_id: user.id
      }
    })

    await fetchUsers(currentPage, currentPageSize);
  }

  const allowUpdateStatus = (user, falseEl, trueEl) => {
    if(!checkPermission()){
      return falseEl
    }

    if(!user.is_superuser && checkIsSuperuser()){
      return trueEl
    }

    if(user.is_staff){
      return falseEl
    }

    return trueEl
  }

  const allowUpdateStaff = (user, falseEl, trueEl) => {
    if(user.is_superuser){
      return falseEl
    }

    if(checkIsSuperuser()){
      return trueEl
    }

    return falseEl
  }

  return (
    <>
      <Block name="people-list">
        <Elem name="wrapper">
          {usersList ? (
            <Elem name="users">
              <Elem name="header">
                <Elem name="column" mix="avatar" />
                <Elem name="column" mix="email">
                  Email
                </Elem>
                <Elem name="column" mix="name">
                  Name
                </Elem>
                <Elem name="column" mix="role">
                  Role
                </Elem>
                <Elem name="column" mix="status">
                  Status
                </Elem>
                <Elem name="column" mix="last-activity">
                  Last Activity
                </Elem>
              </Elem>
              <Elem name="body">
                {usersList.map(({ user }) => {
                  const active = user.id === selectedUser?.id;

                  return (
                    <Elem key={`user-${user.id}`} name="user" mod={{ active }} onClick={() => selectUser(user)}>
                      <Elem name="field" mix="avatar">
                        <CopyableTooltip title={`User ID: ${user.id}`} textForCopy={user.id}>
                          <Userpic user={user} style={{ width: 28, height: 28 }} />
                        </CopyableTooltip>
                      </Elem>
                      <Elem name="field" mix="email">
                        {user.email}
                      </Elem>
                      <Elem name="field" mix="name">
                        {user.first_name} {user.last_name}
                      </Elem>
                      <Elem name="field" mix="role">
                        {
                          allowUpdateStaff(user,
                            user.is_superuser ?
                              'Superuser' :
                              user.is_staff ?
                                'Staff' :
                                'User',
                            <Switch
                              checkedChildren="Staff"
                              unCheckedChildren="User"
                              checked={user.is_staff}
                              onChange={(staff) => changeUserStaff(staff, user)}
                              loading={user.staffLoading}
                            />
                          )
                        }
                      </Elem>
                      <Elem name="field" mix="status">
                        {
                          allowUpdateStatus(user,
                            user.is_active ? 'Enabled' : 'Disabled',
                            <Switch
                              checkedChildren="Enabled"
                              unCheckedChildren="Disabled"
                              checked={user.is_active}
                              onChange={(status) => changeUserStatus(status, user)}
                              loading={user.statusLoading}
                            />
                          )
                        }
                      </Elem>
                      <Elem name="field" mix="last-activity">
                        {formatDistance(new Date(user.last_activity), new Date(), { addSuffix: true })}
                      </Elem>
                    </Elem>
                  );
                })}
              </Elem>
            </Elem>
          ) : (
            <Elem name="loading">
              <Spinner size={36} />
            </Elem>
          )}
        </Elem>
        <Pagination
          page={currentPage}
          urlParamName="page"
          totalItems={totalItems}
          pageSize={currentPageSize}
          pageSizeOptions={[30, 50, 100]}
          onPageLoad={fetchUsers}
          style={{ paddingTop: 16 }}
        />
      </Block>
    </>
  );
};
