import {useEffect, useState} from "react"
import {CreateUpdateForm} from "components/adminusers"
import {Box} from "@chakra-ui/react"
import {AdminUserGroups, AdminUsers, User} from "ordercloud-javascript-sdk"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import {IAdminUser} from "types/ordercloud/IAdminUser"

export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Edit admin user",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

const AdminUserListItem = () => {
  const router = useRouter()
  const [adminUser, setAdminUser] = useState({} as User)
  const [permissions, setPermissions] = useState([])
  useEffect(() => {
    const getAdminUser = async () => {
      const user = await AdminUsers.Get<IAdminUser>(router.query.adminuserid as string)
      const userGroupAssignments = await AdminUserGroups.ListUserAssignments({userID: user.ID})
      setPermissions(userGroupAssignments.Items.map((p) => p.UserGroupID))
      setAdminUser(user)
    }
    if (router.query.adminuserid) {
      getAdminUser()
    }
  }, [router.query.adminuserid])
  return (
    <>{adminUser?.ID ? <CreateUpdateForm user={adminUser} assignedPermissions={permissions} /> : <div> Loading</div>}</>
  )
}

const ProtectedAdminUserListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SettingsManager}>
      <Box padding="GlobalPadding">
        <AdminUserListItem />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedAdminUserListItem
