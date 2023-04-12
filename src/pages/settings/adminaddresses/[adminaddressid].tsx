import {useEffect, useState} from "react"
import {CreateUpdateForm} from "components/adminaddresses"
import {Box} from "@chakra-ui/react"
import {Address, AdminAddresses} from "ordercloud-javascript-sdk"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "hooks/useRouter"
import {IAdminAddress} from "types/ordercloud/IAdminAddress"

export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Edit admin address",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

const AdminAddressListItem = () => {
  const router = useRouter()
  const [adminAddress, setAdminAddress] = useState({} as Address)
  useEffect(() => {
    const getAdminAddress = async () => {
      const address = await AdminAddresses.Get<IAdminAddress>(router.query.adminaddressid as string)
      setAdminAddress(address)
    }
    if (router.query.adminaddressid) {
      getAdminAddress()
    }
  }, [router.query.adminaddressid])
  return <>{adminAddress?.ID ? <CreateUpdateForm address={adminAddress} /> : <div> Loading</div>}</>
}

const ProtectedAdminAddressListItem = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SettingsManager}>
      <Box padding="GlobalPadding">
        <AdminAddressListItem />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedAdminAddressListItem
