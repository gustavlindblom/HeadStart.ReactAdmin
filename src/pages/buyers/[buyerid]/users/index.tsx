import {Box, Button, ButtonGroup, HStack, Icon, Text} from "@chakra-ui/react"
import {ListPage, User, Users} from "ordercloud-javascript-sdk"
import {OrderCloudTableColumn, OrderCloudTableFilters} from "components/ordercloud-table"
import {useCallback, useEffect, useMemo, useState} from "react"

import Card from "components/card/Card"
import {DataTable} from "components/data-table/DataTable"
import ExportToCsv from "components/demo/ExportToCsv"
import {IBuyerUser} from "types/ordercloud/IBuyerUser"
import {IoMdClose} from "react-icons/io"
import {Link} from "components/navigation/Link"
import {MdCheck} from "react-icons/md"
import React from "react"
import {useRouter} from "hooks/useRouter"
import {useSuccessToast} from "hooks/useToast"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Users List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const UsersList = () => {
  const router = useRouter()
  const successToast = useSuccessToast()
  const [tableData, setTableData] = useState(null as ListPage<User>)
  const [filters, setFilters] = useState({} as OrderCloudTableFilters)

  const fetchData = useCallback(
    async (filters: OrderCloudTableFilters) => {
      setFilters(filters)
      const usersList = await Users.List<IBuyerUser>(router.query.buyerid as string, filters)
      setTableData(usersList)
    },
    [router.query.buyerid]
  )

  useEffect(() => {
    fetchData({})
  }, [fetchData])

  const deleteBuyer = useCallback(
    async (userId: string) => {
      await Users.Delete(router.query.buyerid as string, userId)
      fetchData({})
      successToast({
        description: "Buyer deleted successfully."
      })
    },
    [fetchData, router.query.buyerid, successToast]
  )

  const columnsData = useMemo(
    (): OrderCloudTableColumn<User>[] => [
      {
        Header: "FirstName",
        accessor: "FirstName",
        Cell: ({value, row}) => <Link href={`/buyers/${router.query.buyerid}/users/${row.original.ID}`}>{value}</Link>
      },
      {
        Header: "LastName",
        accessor: "LastName"
      },
      {
        Header: "Company ID",
        accessor: "CompanyID"
      },
      {
        Header: "Username",
        accessor: "Username"
      },
      {
        Header: "Email",
        accessor: "Email"
      },
      {
        Header: "Phone",
        accessor: "Phone"
      },
      {
        Header: "TermsAccepted",
        accessor: "TermsAccepted"
      },
      {
        Header: "Active",
        accessor: "Active",
        Cell: ({row}) => (
          <>
            <Icon
              as={row.original.Active === true ? MdCheck : IoMdClose}
              color={row.original.Active === true ? "green.400" : "red.400"}
              w="20px"
              h="20px"
            />
            <Text>{row.original.Active ? "Active" : "Non active"}</Text>
          </>
        )
      },
      {
        Header: "ACTIONS",
        Cell: ({row}) => (
          <ButtonGroup>
            <Button
              variant="secondaryButton"
              onClick={() => router.push(`/buyers/${router.query.buyerid}/users/${row.original.ID}`)}
            >
              Edit
            </Button>
            <Button variant="secondaryButton" onClick={() => deleteBuyer(row.original.ID)}>
              Delete
            </Button>
          </ButtonGroup>
        )
      }
    ],
    [deleteBuyer, router]
  )

  return (
    <Box padding="GlobalPadding">
      <HStack justifyContent="space-between" w="100%" mb={5}>
        <Button onClick={() => router.push(`/buyers/${router.query.buyerid}/users/add`)} variant="primaryButton">
          Create user
        </Button>
        <HStack>
          <ExportToCsv />
        </HStack>
      </HStack>
      <Card variant="primaryCard">
        <DataTable data={tableData} columns={columnsData} filters={filters} fetchData={fetchData} />
      </Card>
    </Box>
  )
}

export default UsersList
