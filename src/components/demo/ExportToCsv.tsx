import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  Spinner,
  Text
} from "@chakra-ui/react"
import {useEffect, useRef, useState} from "react"

export default function ExportToCsv() {
  const [loading, setLoading] = useState(false)
  const [isExportCSVDialogOpen, setExportCSVDialogOpen] = useState(false)
  const cancelRef = useRef()
  function requestExportCSV() {
    console.log("Demo Feature >> Not implemented!")
    setExportCSVDialogOpen(false)
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <>
      <Button variant="secondaryButton" onClick={() => setExportCSVDialogOpen(true)}>
        Export to CSV
      </Button>
      <AlertDialog
        isOpen={isExportCSVDialogOpen}
        onClose={() => setExportCSVDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Export items to CSV
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Export the selected items to a CSV, once the export button is clicked behind the scenes a job will be
                kicked off to create the csv and then will automatically download to your downloads folder in the
                browser.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button
                  ref={cancelRef}
                  onClick={() => setExportCSVDialogOpen(false)}
                  disabled={loading}
                  variant="secondaryButton"
                >
                  Cancel
                </Button>
                <Button onClick={() => requestExportCSV()} disabled={loading}>
                  {loading ? <Spinner color="brand.500" /> : "Export items to CSV"}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
