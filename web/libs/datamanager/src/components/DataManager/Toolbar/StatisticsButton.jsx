import {inject, observer} from "mobx-react";
import {Button} from "../../Common/Button/Button";

const injector = inject(({ store }) => ({
  store,
}));

export const StatisticsButton = injector(({ store, size }) => {

  console.log(store)

  return (
    <div>
      <Button size={size} mod={{ size: size ?? "medium" }} >
        查看统计情况
      </Button>
    </div>
  )
})
