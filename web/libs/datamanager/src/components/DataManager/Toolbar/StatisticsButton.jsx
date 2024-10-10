import {inject} from "mobx-react";
import {Button} from "../../Common/Button/Button";
import {useSDK} from "../../../providers/SDKProvider";
import {useEffect, useState, useCallback} from "react";
import {List, Modal, Spin, Table} from "antd";

const injector = inject(({ store }) => ({
  store,
}));

export const StatisticsButton = injector(({ store, size }) => {
  const {api} = useSDK()
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState([])
  const projectId = store.project.id

  const columns = [
    {
      title: '编号',
      dataIndex: 'user_id',
      key: 'user_id'
    },
    {
      title: '姓名',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '图片总数',
      dataIndex: 'task_count',
      key: 'task_count'
    },
    {
      title: '标记总数',
      dataIndex: 'count',
      key: 'count'
    },
    {
      title: '详细',
      dataIndex: 'result',
      key: 'result',
      render: (result) => {
        return (
          <div>
            {Object.entries(result).map(([key, value]) => (
              <div key={key}>{`${key}: ${value}`}</div>
            ))}
          </div>
        )
      }
    },
  ]

  const getStatistics = async () => {
    setLoading(true)

    const data = await api.projectAnnotation({ projectID: projectId });
    setResult(data)

    setLoading(false)
  }

  const statistics = async () => {
    const modal = Modal.info({
      title: '数据统计',
      content: (
        <div style={{'textAlign': 'center', 'width': '100%', 'paddingRight': '38px'}}>
          <Spin size="large" />
        </div>
      ),
      width: '1000px',
    })

    await getStatistics()

    modal.update({
      content: (
        <div style={{'textAlign': 'center', 'width': '100%', 'paddingRight': '38px'}}>
          <Table columns={columns} dataSource={result} />
        </div>
      )
    })
  }

  useEffect(() => {
    getStatistics()
  }, [projectId]);

  return (
    <div>
      <Button size={size} mod={{ size: size ?? "medium" }} onClick={statistics} >
        Statistics
      </Button>
    </div>
  )
})
